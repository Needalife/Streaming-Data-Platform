package config

import (
	"github.com/go-redis/redis/v8"
)

// Deps holds the dependencies that handlers need (e.g. Redis).
type Deps struct {
	RedisClient *redis.Client
}
