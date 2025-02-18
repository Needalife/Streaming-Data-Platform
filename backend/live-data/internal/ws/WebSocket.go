package ws

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// WebSocket clients map
var rawClients = make(map[*websocket.Conn]bool)
var structuredClients = make(map[*websocket.Conn]bool)
var mutex = sync.Mutex{}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Handle WebSocket connections for raw data
func HandleRawConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket Upgrade Error:", err)
		return
	}
	defer conn.Close()

	mutex.Lock()
	rawClients[conn] = true
	mutex.Unlock()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(rawClients, conn)
			mutex.Unlock()
			break
		}
	}
}

// Handle WebSocket connections for structured data
func HandleStructuredConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket Upgrade Error:", err)
		return
	}
	defer conn.Close()

	mutex.Lock()
	structuredClients[conn] = true
	mutex.Unlock()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			mutex.Lock()
			delete(structuredClients, conn)
			mutex.Unlock()
			break
		}
	}
}

// Broadcast raw transaction data
func BroadcastRawMessage(data interface{}) {
	mutex.Lock()
	defer mutex.Unlock()

	for client := range rawClients {
		err := client.WriteJSON(data)
		if err != nil {
			client.Close()
			delete(rawClients, client)
		}
	}
}

// Broadcast aggregated structured data
func BroadcastStructuredData(data map[string]interface{}) {
	mutex.Lock()
	defer mutex.Unlock()

	for client := range structuredClients {
		err := client.WriteJSON(data)
		if err != nil {
			client.Close()
			delete(structuredClients, client)
		}
	}
}
