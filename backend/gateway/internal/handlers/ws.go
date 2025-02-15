package handlers

import (
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

const liveDataWebSocketURL = "ws://live-data:8090/ws"

func ForwardWSConnection(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP to WebSocket for client
	clientConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading WebSocket:", err)
		http.Error(w, "WebSocket upgrade failed", http.StatusInternalServerError)
		return
	}
	defer clientConn.Close()

	// Connect to Live Data WebSocket
	liveDataConn, _, err := websocket.DefaultDialer.Dial(liveDataWebSocketURL, nil)
	if err != nil {
		fmt.Println("Error connecting to Live Data WebSocket:", err)
		http.Error(w, "Failed to connect to Live Data WebSocket", http.StatusInternalServerError)
		return
	}
	defer liveDataConn.Close()

	fmt.Println("WebSocket connected: Listening to Live Data...")

	errChan := make(chan error)

	// Client → Live Data
	go func() {
		for {
			messageType, msg, err := clientConn.ReadMessage()
			if err != nil {
				// Handle normal WebSocket close
				if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
					fmt.Println("Client disconnected: Normal closure.")
				} else {
					fmt.Println("Error reading from Client:", err)
				}
				errChan <- err
				return
			}

			err = liveDataConn.WriteMessage(messageType, msg)
			if err != nil {
				errChan <- err
				return
			}
		}
	}()

	// Live Data → Client
	go func() {
		for {
			messageType, msg, err := liveDataConn.ReadMessage()
			if err != nil {
				if websocket.IsCloseError(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
					fmt.Println("Live Data disconnected: Normal closure.")
				} else {
					fmt.Println("Error reading from Live Data:", err)
				}
				errChan <- err
				return
			}

			err = clientConn.WriteMessage(messageType, msg)
			if err != nil {
				errChan <- err
				return
			}
		}
	}()

	<-errChan
}
