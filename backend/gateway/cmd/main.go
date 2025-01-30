package main

import (
	"gateway/internal/config"
	"log"
)

func main() {
	cfg := config.LoadAppConfig()

	app := &application{
		config: cfg,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}