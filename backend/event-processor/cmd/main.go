package main

import (
	"context"
	"event-processor/config"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("MONGO_URI not found")
	}

	client := config.ConnectMongo(uri)
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatal("Error disconnecting MongoDB:", err)
		}
		log.Println("✅ Disconnected from MongoDB!")
	}()

	database := client.Database("test")
	collecion := database.Collection("test")

	config.WatchChanges(collecion)
}
