package ws

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	rawClients        = make(map[*websocket.Conn]bool)
	structuredClients = make(map[*websocket.Conn]bool)
	mutex             = sync.Mutex{}
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
