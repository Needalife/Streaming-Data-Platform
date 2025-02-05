package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"static-data/api"
	"static-data/db"
	"static-data/kafka"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	mongoURI := os.Getenv("MONGO_URI")
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	topic := os.Getenv("KAFKA_TOPIC")
	groupID := os.Getenv("KAFKA_GROUP_ID")

	// Connect to MongoDB
	client := db.ConnectMongo(mongoURI)
	defer client.Disconnect(nil)

	// Start Kafka Consumer (Runs concurrently)
	go kafka.StartConsumer(kafkaBroker, topic, groupID, client)

	// HTTP Server
	http.HandleFunc("GET /transactions", api.GetTransactions(client))
	http.HandleFunc("GET /transactions/{id}", api.GetTransactionByID(client))
	http.HandleFunc("GET /transactions/filters", api.GetFilterOptions(client))
	http.HandleFunc("POST /transactions/search", api.SearchTransactions(client))
	http.HandleFunc("GET /transactions/dates", api.GetAvailableDates(client))

	// Start HTTP Server
	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
