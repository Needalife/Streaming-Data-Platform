package main

import (
	"context"
	"fmt"
	"os"
	"static-data/db"
	"static-data/kafka"

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

	kafkaHost := os.Getenv("KAFKA_HOST")
	kafkaPort := os.Getenv("KAFKA_PORT")
	if kafkaHost == "" || kafkaPort == "" {
		fmt.Println("Kafka environment variables not found")
	}

	kafkaBrokers := []string{fmt.Sprintf("%s:%s", kafkaHost, kafkaPort)}
	kafka.StartConsumer(kafkaBrokers, "data-lake")
}
