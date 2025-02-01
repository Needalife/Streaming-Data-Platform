package db

import (
	"context"
	"encoding/json"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func WatchChanges(collection *mongo.Collection, onChange func(change string)) {
	ctx := context.TODO()

	stream, err := collection.Watch(ctx, mongo.Pipeline{}, options.ChangeStream().SetFullDocument(options.UpdateLookup))
	if err != nil {
		panic(err)
	}
	defer stream.Close(ctx)

	fmt.Println("Watching for changes...")
	for stream.Next(ctx) {
		var event bson.M
		if err := stream.Decode(&event); err != nil {
			fmt.Printf("Fail to decode event %v \n", err)
			continue
		}

		eventJSON, err := json.Marshal(event)
		if err != nil {
			fmt.Printf("Fail to marshal event: %v \n", err)
		}

		onChange(string(eventJSON))
	}

	if err := stream.Err(); err != nil {
		panic(err)
	}
}
