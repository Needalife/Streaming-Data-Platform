package db

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
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
	dbName := "static_data"
	dbInstance := client.Database(dbName)

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

	// Build a filter from query parameters.
	filter := bson.M{}

	// Filter by status.
	if status := r.URL.Query().Get("status"); status != "" {
		filter["status"] = status
	}

	// Filter by price range (amount).
	minAmountStr := r.URL.Query().Get("minAmount")
	maxAmountStr := r.URL.Query().Get("maxAmount")
	if minAmountStr != "" || maxAmountStr != "" {
		amountFilter := bson.M{}
		if minAmountStr != "" {
			if minVal, err := strconv.ParseFloat(minAmountStr, 64); err == nil {
				amountFilter["$gte"] = minVal
			}
		}
		if maxAmountStr != "" {
			if maxVal, err := strconv.ParseFloat(maxAmountStr, 64); err == nil {
				amountFilter["$lte"] = maxVal
			}
		}
		if len(amountFilter) > 0 {
			filter["amount"] = amountFilter
		}
	}

	// Implement snapshot filtering.
	// If the client did not provide a snapshotTime, use the current time.
	// Use a format that matches your createdAt field (e.g., ISO8601).
	snapshotTime := r.URL.Query().Get("snapshotTime")
	if snapshotTime == "" {
		snapshotTime = time.Now().Format("2006-01-02T15:04:05Z07:00")
	}
	// Only include transactions created at or before the snapshot.
	filter["createdAt"] = bson.M{"$lte": snapshotTime}

	// Always aggregate across all collections that match the pattern.
	collections, err := dbInstance.ListCollectionNames(ctx, bson.M{
		"name": bson.M{"$regex": "^collection_"},
	})
	if err != nil {
		return nil, err
	}

	var aggregatedResults []bson.M
	for _, collName := range collections {
		coll := dbInstance.Collection(collName)
		cursor, err := coll.Find(ctx, filter)
		if err != nil {
			log.Printf("Error querying collection %s: %v", collName, err)
			continue
		}

		var results []bson.M
		if err := cursor.All(ctx, &results); err != nil {
			cursor.Close(ctx)
			log.Printf("Error reading results from collection %s: %v", collName, err)
			continue
		}
		cursor.Close(ctx)
		aggregatedResults = append(aggregatedResults, results...)
	}

	// Sort the aggregated results by createdAt descending (newest first).
	sort.Slice(aggregatedResults, func(i, j int) bool {
		ci, _ := aggregatedResults[i]["createdAt"].(string)
		cj, _ := aggregatedResults[j]["createdAt"].(string)
		return ci > cj
	})

	// Apply pagination manually.
	total := len(aggregatedResults)
	if skip >= total {
		return []bson.M{}, nil
	}
	end := skip + limit
	if end > total {
		end = total
	}
	return aggregatedResults[skip:end], nil
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

// Creates a text index on the "name", "email", "status", and "type" fields.
func EnsureTextIndex(client *mongo.Client, dbName, collectionName string) error {
	coll := client.Database(dbName).Collection(collectionName)
	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{Key: "name", Value: "text"},
			{Key: "email", Value: "text"},
			{Key: "status", Value: "text"},
			{Key: "type", Value: "text"},
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
