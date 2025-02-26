package main

import (
	"gateway/internal/config"
	"log"
)

func main() {
	// Load configuration.
	cfg := config.LoadAppConfig()

	app := Application(cfg)

	mux := app.mount()
	log.Fatal(app.run(mux))
}
