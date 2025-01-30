package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port string
}

func LoadConfig() Config {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	return Config{
		Port: os.Getenv("PORT"),
	}
}