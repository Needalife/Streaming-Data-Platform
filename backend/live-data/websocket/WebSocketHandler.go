package websocket

import (
	"fmt"
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

// Handle Websocket connections
func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	log.Println("New WebSocket connection established")
	connections.Store(conn, true)

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			log.Println("WebSocket connection closed:", err)
			connections.Delete(conn)
			return
		}
	}
}

func BroadcastToWebSockets(data string) {
	connections.Range(func(key, value interface{}) bool {
		conn := key.(*websocket.Conn)
		if err := conn.WriteMessage(websocket.TextMessage, []byte(data)); err != nil {
			log.Println("Error broadcasting WebSocket message:", err)
			connections.Delete(conn)
		}
		return true
	})
}

func StartWebSocketServer(port string) {
	if port == "" {
		port = os.Getenv("WS_PORT")
	}

	http.HandleFunc("/ws", HandleWebSocket)
	fmt.Printf("WebSocket is running on :%s\n", port)
}
