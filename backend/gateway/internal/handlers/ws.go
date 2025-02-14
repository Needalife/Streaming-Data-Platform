package handlers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

const liveDataWebSocketURL = "ws://livedata:8090/ws"

func ForwardWSConnection(w http.ResponseWriter, r *http.Request) {
	clientConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error updating Websocket:", err)
		http.Error(w, "Fail to establish ws connection", http.StatusInternalServerError)
		return
	}
	defer clientConn.Close()

	liveDataConn, _, err := websocket.DefaultDialer.Dial(liveDataWebSocketURL, nil)
	if err != nil {
		fmt.Println("Error connecting to live-data service:", err)
		http.Error(w, "Failed to connect to live-data service", http.StatusInternalServerError)
		return
	}
	defer liveDataConn.Close()

	errChan := make(chan error)



	
}
