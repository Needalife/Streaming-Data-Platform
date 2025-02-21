package redis

import (
	"time"

	"github.com/go-redis/redis/v8"
)

// SetCache stores the given value under the specified key for the given TTL.
func SetCache(client *redis.Client, key string, value interface{}, ttl time.Duration) error {
	return client.Set(Ctx, key, value, ttl).Err()
}

// GetCache retrieves the value for the specified key.
// It returns the value as a string (which should be JSON-encoded data).
func GetCache(client *redis.Client, key string) (string, error) {
	return client.Get(Ctx, key).Result()
}
