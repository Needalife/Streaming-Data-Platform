package main

import (
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	connections = sync.Map{}
)

func main() {
	kafkaTopic := os.Getenv("KAFKA_TOPIC")
	kafkaBroker := os.Getenv("KAFKA_BROKER")
	websocketPort := os.Getenv("WS_PORT")

	// Start Kafka listener in a goroutine
	go startKafkaListener(kafkaBroker, kafkaTopic)

	http.HandleFunc("/ws", handleWebSocket)
	log.Printf("WebSocket server running on :%s", websocketPort)
	log.Fatal(http.ListenAndServe(":"+websocketPort, nil))
}
