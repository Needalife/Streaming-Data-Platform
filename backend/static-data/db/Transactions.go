package db

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Fetches transactions with optional filters from today's collection.
func FetchTransactions(client *mongo.Client, r *http.Request) ([]bson.M, error) {
	// Use the request context for cancellation and deadlines.
	ctx := r.Context()

	collectionName := "collection_" + time.Now().Format("2006-01-02")
	collection := client.Database("static_data").Collection(collectionName)

	// Build filter from query parameters
	filter := bson.M{}
	if status := r.URL.Query().Get("status"); status != "" {
		filter["status"] = status
	}

	limitStr := r.URL.Query().Get("limit")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 10
	}

	findOptions := options.Find().SetLimit(int64(limit))
	cursor, err := collection.Find(ctx, filter, findOptions)
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

// Retrieves a specific transaction by its ID from today's collection.
func FetchTransactionByID(client *mongo.Client, id string) (bson.M, error) {
	ctx := context.Background()
	collectionName := "collection_" + time.Now().Format("2006-01-02")
	collection := client.Database("static_data").Collection(collectionName)

	var result bson.M
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("transaction with ID %s not found", id)
	}
	return result, nil
}

// Returns a static list of filter options.
func GetFilterOptions(client *mongo.Client) []string {
	return []string{"pending", "completed", "failed"}
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

	// Get the list of all collections that start with "collection_"
	collections, err := client.Database(dbName).ListCollectionNames(ctx, bson.M{
		"name": bson.M{"$regex": "^collection_"},
	})
	if err != nil {
		return nil, err
	}

	var allResults []bson.M

	// Loop through each collection, ensure the text index exists, and search for the keyword.
	for _, collName := range collections {
		// Ensure the text index exists on this collection.
		if err := EnsureTextIndex(client, dbName, collName); err != nil {
			// Optionally log the error and continue with other collections.
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
