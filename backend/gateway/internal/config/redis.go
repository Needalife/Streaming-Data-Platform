package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type RedisConfig struct {
	Username string
	Password string
}

func LoadRedisConfig() RedisConfig {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	return RedisConfig{
		Username: os.Getenv("REDIS_USERNAME"),
		Password: os.Getenv("REDIS_PASSWORD"),
	}
}
