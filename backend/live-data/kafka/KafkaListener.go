package kafka

import (
	"context"
	"encoding/json"
	"live-data/websocket"
	"log"
	"os"

	"github.com/segmentio/kafka-go"
)

func StartKafkaListener(brokers []string) *kafka.Reader {
	topic := os.Getenv("KAFKA_TOPIC")

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: brokers,
		Topic:   topic,
		// GroupID: "live-data-group",
	})

	log.Printf("Kafka is listening to %s", topic)

	go func() {
		for {
			m, err := reader.ReadMessage(context.Background())
			if err != nil {
				log.Println("Error reading Kafka message:", err)
				continue
			}

			// Parse Kafka message
			var transaction map[string]interface{}
			if err := json.Unmarshal(m.Value, &transaction); err != nil {
				log.Println("Error parsing Kafka message:", err)
				continue
			}

			// Broadcast to WebSocket clients
			websocket.BroadcastToWebSockets(string(m.Value))
		}
	}()

	return reader
}
