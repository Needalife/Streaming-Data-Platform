package redis

import (
	"time"

	"github.com/go-redis/redis/v8"
)

// SetCache stores a value in Redis under the specified key with a TTL.
func SetCache(client *redis.Client, key string, value interface{}, ttl time.Duration) error {
	return client.Set(Ctx, key, value, ttl).Err()
}

// GetCache retrieves the string value from Redis for the specified key.
func GetCache(client *redis.Client, key string) (string, error) {
	return client.Get(Ctx, key).Result()
}
