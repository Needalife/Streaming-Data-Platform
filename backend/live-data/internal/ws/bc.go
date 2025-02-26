package ws

import "github.com/gorilla/websocket"

func BroadcastRawMessage(data interface{}) {
	broadcastMessage(data, rawClients)
}

func BroadcastStructuredData(data map[string]interface{}) {
	broadcastMessage(data, structuredClients)
}

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
