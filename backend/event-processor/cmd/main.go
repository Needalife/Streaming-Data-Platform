package main

import (
	"context"
	"event-processor/config"
	"github.com/joho/godotenv"
	"fmt"
	"os"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}
	
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("MONGO_URI not found")
	}

	client := config.ConnectMongo(uri)
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println("Error disconnecting MongoDB:", err)
		}
		fmt.Println("Disconnected from MongoDB!")
	}()

	database := client.Database("test")
	collecion := database.Collection("test")

	config.WatchChanges(collecion)
}
