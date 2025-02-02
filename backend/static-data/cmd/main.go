package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"os"
	"static-data/db"
	"static-data/kafka"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	mongoURI := os.Getenv("MONGO_URI")
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	topic := os.Getenv("KAFKA_TOPIC")
	groupID := os.Getenv("KAFKA_GROUP_ID")

	client := db.ConnectMongo(mongoURI) // Establish MongoDB connection
	defer client.Disconnect(nil)        // Graceful disconnection

	kafka.StartConsumer(kafkaBroker, topic, groupID, client)
}
