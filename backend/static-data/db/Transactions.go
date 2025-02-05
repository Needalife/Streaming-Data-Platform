package db

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Fetch Transactions with Filters
func FetchTransactions(client *mongo.Client, r *http.Request) ([]bson.M, error) {
	collection := client.Database("static_data").Collection("collection_" + time.Now().Format("2006-01-02"))

	// Query Parameters
	filter := bson.M{}
	status := r.URL.Query().Get("status")
	if status != "" {
		filter["status"] = status
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit == 0 {
		limit = 10
	}

	cursor, err := collection.Find(context.TODO(), filter, options.Find().SetLimit(int64(limit)))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []bson.M
	if err := cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

// Fetch Transaction by ID
func FetchTransactionByID(client *mongo.Client, id string) (bson.M, error) {
	collection := client.Database("static_data").Collection("collection_" + time.Now().Format("2006-01-02"))
	var result bson.M
	err := collection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return nil, fmt.Errorf("transaction with ID %s not found", id)
	}
	return result, nil
}

// Get Filter Options
func GetFilterOptions(client *mongo.Client) []string {
	// Static filter options; can be dynamic if needed
	return []string{"pending", "completed", "failed"}
}

// Search Transactions by Keyword
func SearchTransactions(client *mongo.Client, keyword string) ([]bson.M, error) {
	collection := client.Database("static_data").Collection("collection_" + time.Now().Format("2006-01-02"))

	// Text search filter
	filter := bson.M{"$text": bson.M{"$search": keyword}}

	cursor, err := collection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var results []bson.M
	if err := cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

// Fetch Available Dates (Collections)
func FetchAvailableDates(client *mongo.Client) ([]string, error) {
	collections, err := client.Database("static_data").ListCollectionNames(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}
	return collections, nil
}
