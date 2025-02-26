package main

import (
	"fmt"
	"live-data/internal/cfg"
	"live-data/internal/kafka"
	"live-data/internal/ws"
	"net/http"
)

type application struct {
	appConfig   cfg.AppConfig
	kafkaConfig cfg.KafkaConfig
}

func (app *application) mount() {
	go kafka.StartConsumer(app.kafkaConfig.Broker, app.kafkaConfig.Topic, "live-data-consumer")

	http.HandleFunc("/ws/raw", ws.HandleRawConnections)
	http.HandleFunc("/ws/structured", ws.HandleStructuredConnections)
}

func (app *application) run() error {
	fmt.Printf("Live Data WebSocket server started on port%s\n", app.appConfig.Port)
	return http.ListenAndServe(app.appConfig.Port, nil)
}
