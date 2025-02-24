package db

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

// FetchTransactions fetches transactions with optional filters and pagination.
// It supports filtering by status and by a price range (minAmount and maxAmount).
// When the query parameter "all" is set to "true", it aggregates transactions
// from all collections; otherwise, it uses a single collection based on the "date" parameter.
func FetchTransactions(client *mongo.Client, r *http.Request) ([]bson.M, error) {
	ctx := r.Context()
	dbInstance := client.Database("static_data")

	// Parse pagination parameters.
	limitStr := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}
	skipStr := r.URL.Query().Get("skip")
	skip, err := strconv.Atoi(skipStr)
	if err != nil || skip < 0 {
		skip = 0
	}

	// Build filter from query parameters.
	filter := bson.M{}
	if status := r.URL.Query().Get("status"); status != "" {
		filter["status"] = status
	}
	if minAmountStr := r.URL.Query().Get("minAmount"); minAmountStr != "" {
		if minVal, err := strconv.ParseFloat(minAmountStr, 64); err == nil {
			filter["amount"] = bson.M{"$gte": minVal}
		}
	}
	if maxAmountStr := r.URL.Query().Get("maxAmount"); maxAmountStr != "" {
		if maxVal, err := strconv.ParseFloat(maxAmountStr, 64); err == nil {
			if cur, ok := filter["amount"].(bson.M); ok {
				cur["$lte"] = maxVal
			} else {
				filter["amount"] = bson.M{"$lte": maxVal}
			}
		}
	}

	snapshotTime := r.URL.Query().Get("snapshotTime")
	if snapshotTime == "" {
		snapshotTime = time.Now().Format("2006-01-02T15:04:05Z07:00")
	}
	filter["createdAt"] = bson.M{"$lte": snapshotTime}

	// List all collections that match your naming pattern.
	allCollections, err := dbInstance.ListCollectionNames(ctx, bson.M{
		"name": bson.M{"$regex": "^collection_"},
	})
	if err != nil {
		return nil, err
	}

	// Filter collections based on snapshotTime.
	var relevantCollections []string
	snapshotDate, _ := time.Parse("2006-01-02T15:04:05Z07:00", snapshotTime)
	for _, collName := range allCollections {
		// Assume the date is at the end of the collection name like "collection_2025-02-24".
		// Extract the date portion.
		datePart := strings.TrimPrefix(collName, "collection_")
		collDate, err := time.Parse("2006-01-02", datePart)
		if err != nil {
			log.Printf("Skipping collection %s due to date parse error: %v", collName, err)
			continue
		}
		// Only include collections with dates <= snapshotDate.
		if !collDate.After(snapshotDate) {
			relevantCollections = append(relevantCollections, collName)
		}
	}
	if len(relevantCollections) == 0 {
		return nil, fmt.Errorf("no collections found for snapshotTime %s", snapshotTime)
	}

	// Sort relevantCollections in descending order so the most recent is first.
	// (You can adjust this if needed.)
	sort.Slice(relevantCollections, func(i, j int) bool {
		return relevantCollections[i] > relevantCollections[j]
	})

	// Build the aggregation pipeline.
	// Use the first collection in the sorted list as the base.
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: filter}},
	}
	for i := 1; i < len(relevantCollections); i++ {
		unionStage := bson.D{
			{Key: "$unionWith", Value: bson.D{
				{Key: "coll", Value: relevantCollections[i]},
				{Key: "pipeline", Value: mongo.Pipeline{
					{{Key: "$match", Value: filter}},
				}},
			}},
		}
		pipeline = append(pipeline, unionStage)
	}

	pipeline = append(pipeline,
		bson.D{{Key: "$sort", Value: bson.D{{Key: "createdAt", Value: -1}}}},
		bson.D{{Key: "$skip", Value: skip}},
		bson.D{{Key: "$limit", Value: limit}},
	)

	// Execute the aggregation on the first collection.
	cursor, err := dbInstance.Collection(relevantCollections[0]).Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		return nil, err
	}
	return results, nil
}

// Retrieves a specific transaction by its ID.
// If dateParam is provided, it first checks that collection.
// If not provided (or not found in that collection), it searches all collections.
func FetchTransactionByID(client *mongo.Client, id string, dateParam string) (bson.M, error) {
	ctx := context.Background()
	dbName := "static_data"
	dbInstance := client.Database(dbName)

	// If a date is provided, try that collection first.
	if dateParam != "" {
		collectionName := "collection_" + dateParam
		var result bson.M
		err := dbInstance.Collection(collectionName).FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err == nil {
			result["collection"] = collectionName
			return result, nil
		}
		// If not found in the provided collection, log the attempt.
		log.Printf("Transaction with ID %s not found in collection %s, searching all collections...", id, collectionName)
	}

	// Search all collections that match the naming pattern.
	collections, err := dbInstance.ListCollectionNames(ctx, bson.M{
		"name": bson.M{"$regex": "^collection_"},
	})
	if err != nil {
		return nil, err
	}

	for _, collName := range collections {
		var result bson.M
		err := dbInstance.Collection(collName).FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err == nil {
			result["collection"] = collName
			return result, nil
		}
	}

	return nil, fmt.Errorf("transaction with ID %s not found", id)
}

func EnsureTextIndex(client *mongo.Client, dbName, collectionName string) error {
	coll := client.Database(dbName).Collection(collectionName)
	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{Key: "name", Value: "text"},
			{Key: "email", Value: "text"},
			{Key: "status", Value: "text"},
			{Key: "type", Value: "text"},
			{Key: "currency", Value: "text"},
		},
	}
	_, err := coll.Indexes().CreateOne(context.Background(), indexModel)
	if err != nil {
		log.Printf("Error creating text index on collection %s: %v", collectionName, err)
		return err
	}
	return nil
}

// Performs a text search on today's collection using the provided keyword.
func SearchTransactions(client *mongo.Client, keyword string) ([]bson.M, error) {
	ctx := context.Background()
	dbName := "static_data"

	collections, err := client.Database(dbName).ListCollectionNames(ctx, bson.M{
		"name": bson.M{"$regex": "^collection_"},
	})
	if err != nil {
		return nil, err
	}

	var allResults []bson.M
	for _, collName := range collections {
		// Ensure the text index exists on this collection.
		if err := EnsureTextIndex(client, dbName, collName); err != nil {
			log.Printf("Skipping collection %s due to index error: %v", collName, err)
			continue
		}

		coll := client.Database(dbName).Collection(collName)
		filter := bson.M{"$text": bson.M{"$search": keyword}}

		cursor, err := coll.Find(ctx, filter)
		if err != nil {
			log.Printf("Error searching collection %s: %v", collName, err)
			continue
		}

		var results []bson.M
		if err := cursor.All(ctx, &results); err != nil {
			log.Printf("Error reading results from collection %s: %v", collName, err)
			continue
		}
		allResults = append(allResults, results...)
	}

	return allResults, nil
}

// Returns the names of all collections.
func FetchAvailableDates(client *mongo.Client) ([]string, error) {
	ctx := context.Background()
	collections, err := client.Database("static_data").ListCollectionNames(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	return collections, nil
}
