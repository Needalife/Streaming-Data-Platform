package main

import (
	"gateway/internal/config"
	"log"
)

func main() {
	cfg := config.LoadConfig()

	app := &application{
		config: cfg,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}