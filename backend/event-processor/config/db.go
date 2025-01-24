package config

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson"
	"time"
	"fmt"
)

func ConnectMongo(uri string) *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	fmt.Println("Connected to MongoDB!")
	return client
}

func WatchChanges(collection *mongo.Collection) {
	ctx := context.TODO()

	stream, err := collection.Watch(ctx, mongo.Pipeline{})
	if err != nil {
		panic(err)
	}
	defer stream.Close(ctx)

	fmt.Println("Watching for changes...")
	for stream.Next(ctx) {
		var event bson.M

		if err := stream.Decode(&event); err != nil {
			fmt.Printf("Fail to decode event %v", err)
			continue
		}

		fmt.Printf("Change detected: %v \n", event)
	}

	if err := stream.Err(); err != nil {
		panic(err)
	}
}