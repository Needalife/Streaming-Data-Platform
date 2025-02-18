package ws

import (
    "fmt"
    "net/http"
	"sync"

    "github.com/gorilla/websocket"
)

// WebSocket clients map and mutex for synchronization.
var (
    rawClients       = make(map[*websocket.Conn]bool)
    structuredClients = make(map[*websocket.Conn]bool)
    mutex            = sync.Mutex{}
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// Handle WebSocket connections for raw data.
func HandleRawConnections(w http.ResponseWriter, r *http.Request) {
	handleConnection(w, r, rawClients)
}

// Handle WebSocket connections for structured data.
func HandleStructuredConnections(w http.ResponseWriter, r *http.Request) {
	handleConnection(w, r, structuredClients)
}

// Generic function to handle WebSocket connections.
func handleConnection(w http.ResponseWriter, r *http.Request, clients map[*websocket.Conn]bool) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
	    fmt.Println("WebSocket Upgrade Error:", err)
	    return
    }
	defer conn.Close()

	mutex.Lock()
    clients[conn] = true
	mutex.Unlock()

	for {
	    _, _, err := conn.ReadMessage()
	    if err != nil {
	        mutex.Lock()
	        delete(clients, conn)
	        mutex.Unlock()
	        break
	    }
    }
}

// Broadcast raw transaction data.
func BroadcastRawMessage(data interface{}) {
	broadcastMessage(data, rawClients)
}

// Broadcast aggregated structured data.
func BroadcastStructuredData(data map[string]interface{}) {
	broadcastMessage(data, structuredClients)
}

// Generic function to broadcast messages to clients.
func broadcastMessage(data interface{}, clients map[*websocket.Conn]bool) {
	mutex.Lock()
	defer mutex.Unlock()

	for client := range clients {
	    if err := client.WriteJSON(data); err != nil {
	        client.Close()
	        delete(clients, client)
	    }
    }
}
