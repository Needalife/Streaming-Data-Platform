package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"static-data/api"
	"static-data/db"
	"static-data/kafka"

	"github.com/gorilla/mux"
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
	defer func() {
		if err := client.Disconnect(context.Background()); err != nil {
			log.Printf("Error disconnecting Mongo client: %v", err)
		}
	}()

	// Start Kafka Consumer (runs concurrently)
	go kafka.StartConsumer(kafkaBroker, topic, groupID, client)

	// Setup router using Gorilla Mux
	router := mux.NewRouter()

	// Static routes (order matters: static routes first)
	router.HandleFunc("/transactions/search", api.SearchTransactions(client)).Methods("GET")
	router.HandleFunc("/transactions/dates", api.GetAvailableDates(client)).Methods("GET")

	// Dynamic route with constraint
	router.HandleFunc("/transactions/{id:[0-9a-fA-F]{24}}", api.GetTransactionByID(client)).Methods("GET")

	// Other route (for transactions list)
	router.HandleFunc("/transactions", api.GetTransactions(client)).Methods("GET")

	fmt.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
