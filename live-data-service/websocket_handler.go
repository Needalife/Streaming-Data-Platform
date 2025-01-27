package main

import (
	"log"
	"net/http"
)

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	log.Println("New WebSocket connection established")
	connections.Store(conn, true)

	// Keep the connection open until the client disconnects
	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			log.Println("WebSocket connection closed:", err)
			connections.Delete(conn)
			return
		}
	}
}
