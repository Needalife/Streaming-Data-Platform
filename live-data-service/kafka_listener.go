package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
	"github.com/segmentio/kafka-go"
)

func startKafkaListener(broker, topic string) {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{broker},
		Topic:   topic,
		GroupID: "live-data-group",
	})
	defer reader.Close()

	log.Printf("Listening to Kafka topic: %s", topic)

	// Listen for new messages from Kafka
	for {
		m, err := reader.ReadMessage(context.Background())
		if err != nil {
			log.Println("Error reading message from Kafka:", err)
			continue
		}

		// Parse the Kafka message
		var transaction map[string]interface{}
		if err := json.Unmarshal(m.Value, &transaction); err != nil {
			log.Println("Error parsing Kafka message:", err)
			continue
		}

		// Broadcast the message to all WebSocket clients
		broadcastToWebSockets(transaction)
	}
}

func broadcastToWebSockets(data interface{}) {
	connections.Range(func(key, value interface{}) bool {
		conn := key.(*websocket.Conn)
		// Write the data to the WebSocket
		if err := conn.WriteJSON(data); err != nil {
			log.Println("Error writing to WebSocket:", err)
			connections.Delete(conn)
		}
		return true
	})
}
