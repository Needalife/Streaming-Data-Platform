package main

import (
	"fmt"
	"live-data/kafka"
	"live-data/websocket"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		fmt.Println("no .env file")
	}

	// Kafka Setup
	kafkaHost := os.Getenv("KAFKA_HOST")
	kafkaPort := os.Getenv("KAFKA_PORT")

	kafkaBrokers := []string{fmt.Sprintf("%s:%s", kafkaHost, kafkaPort)}
	consumer := kafka.StartKafkaListener(kafkaBrokers)
	if consumer == nil {
		fmt.Println("Failed to initialize Kafka consumer")
		return
	}
	defer consumer.Close()

	// Start WebSocket server
	go websocket.StartWebSocketServer(os.Getenv("WS_PORT"))

	// Keep application running
	select {}
}
