package main

import (
	"gateway/internal/config"
	"log"
)

func main() {
	cfg := config.LoadAppConfig()

	app := &application{
		appConfig: cfg,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}