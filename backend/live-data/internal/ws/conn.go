package ws

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

func HandleRawConnections(w http.ResponseWriter, r *http.Request) {
	handleConnection(w, r, rawClients)
}

func HandleStructuredConnections(w http.ResponseWriter, r *http.Request) {
	handleConnection(w, r, structuredClients)
}

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
