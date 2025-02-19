package main

import (
	"fmt"
	"gateway/internal/config"
	"log"

	myredis "gateway/redis"
)

func main() {
	// Initialize the Redis client.
	redisClient := myredis.NewRedisClient()
	fmt.Println("Redis client is ready:", redisClient)

	cfg := config.LoadAppConfig()

	app := &application{
		appConfig: cfg,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}
