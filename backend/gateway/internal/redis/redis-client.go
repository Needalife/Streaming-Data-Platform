package redis

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var Ctx = context.Background()

func NewRedisClient() *redis.Client {
	sentinelHost := os.Getenv("REDIS_SENTINEL_HOST")
	sentinelPort := os.Getenv("REDIS_SENTINEL_PORT")
	masterName := os.Getenv("REDIS_MASTER_NAME")
	redisPassword := os.Getenv("REDIS_PASSWORD")

	if sentinelHost == "" || sentinelPort == "" || masterName == "" {
		log.Fatal("Missing Redis Sentinel configuration in environment variables")
	}

	// Build the Sentinel address.
	sentinelAddr := fmt.Sprintf("%s:%s", sentinelHost, sentinelPort)

	// Create the failover client.
	client := redis.NewFailoverClient(&redis.FailoverOptions{
		MasterName:    masterName,
		SentinelAddrs: []string{sentinelAddr},
		Password:      redisPassword,
	})

	// Test the connection.
	pong, err := client.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis Sentinel: %v", err)
	}
	fmt.Println("Redis connected successfully via Sentinel, response:", pong)
	return client
}
