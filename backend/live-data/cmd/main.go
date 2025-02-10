package main

import (
	"fmt"
	"live-data/kafka"
	"live-data/ws"
	"net/http"
)

func main() {
	// Start Kafka consumer (listening to "data-lake" topic)
	go kafka.StartConsumer("kafka:9092", "data-lake", "live-data-consumer")

	// Start WebSocket server
	http.HandleFunc("/ws", ws.HandleConnections)

	fmt.Println("Live Data WebSocket server started on :8080")
	http.ListenAndServe(":8080", nil)
}
