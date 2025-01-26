package main

import (
	"context"
	"event-processor/db"
	"event-processor/kafka"
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}
	
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		fmt.Println("MONGO_URI not found")
	}

	client := db.ConnectMongo(uri)
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			fmt.Println("Error disconnecting MongoDB:", err)
		}
		fmt.Println("Disconnected from MongoDB!")
	}()

	database := client.Database("test")
	collecion := database.Collection("test")
	
	kafka_host := os.Getenv("KAFKA_HOST")
	kafka_port := os.Getenv("KAFKA_PORT")
	if kafka_host == "" || kafka_port == "" {
		fmt.Println("Kafka env not found")
	}
	
	kafkaBrokers := []string{fmt.Sprintf("%s:%s", kafka_host, kafka_port)}
	producer := kafka.ConnectKafka(kafkaBrokers)
	if producer == nil {
		fmt.Printf("Fail to init kafka producer \n")
		return
	}
	defer producer.Close()

	onChange := func(change string) {
		kafka.SendMessage(producer, "mongo-changes", change)
	}

	db.WatchChanges(collecion, onChange)
}
