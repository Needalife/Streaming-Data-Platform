package main

import (
	"fmt"
	"gateway/internal/config"
	"gateway/internal/deps"
	"log"

	myredis "gateway/internal/redis"
)

func main() {
	// Initialize the Redis client.
	redisClient := myredis.NewRedisClient()
	fmt.Println("Redis client is ready:", redisClient)

	depsStruct := &deps.Deps{
		RedisClient: redisClient,
	}

	cfg := config.LoadAppConfig()

	app := &application{
		appConfig: cfg,
		deps:      depsStruct,
	}

	mux := app.mount()

	log.Fatal(app.run(mux))
}
