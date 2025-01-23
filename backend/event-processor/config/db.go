package config

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/bson"
	"log"
	"time"
)

func ConnectMongo(uri string) *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}

	log.Println("✅ Connected to MongoDB!")
	return client
}

func WatchChanges(collection *mongo.Collection) {
	ctx := context.TODO()

	stream, err := collection.Watch(ctx, mongo.Pipeline{})
	if err != nil {
		panic(err)
	}
	defer stream.Close(ctx)

	log.Println("🔁 Watching for changes...")
	for stream.Next(ctx) {
		var event bson.M

		if err := stream.Decode(&event); err != nil {
			log.Printf("Fail to decode event %v", err)
			continue
		}

		log.Printf("Change detected: %v", event)
	}

	if err := stream.Err(); err != nil {
		log.Fatalf("Stream error: %v", err)
	}
}