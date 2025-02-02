package db

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
)

var client *mongo.Client

func SaveData(client *mongo.Client, database, collection string, data interface{}) {
	if client == nil {
		log.Println("MongoDB client is not initialized")
		return
	}

	coll := client.Database(database).Collection(collection)
	_, err := coll.InsertOne(context.Background(), data)
	if err != nil {
		log.Printf("Failed to insert data: %v", err)
	} else {
		fmt.Printf("Data saved to collection '%s': %v\n", collection, data)
	}
}
