package main

import (
	"live-data/internal/cfg"
)

func main() {
	app := &application{
		appConfig:   cfg.LoadAppConfig(),
		kafkaConfig: cfg.LoadKafkaConfig(),
	}

	app.mount()
	if err := app.run(); err != nil {
		panic(err)
	}
}
