package cfg

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	Port string
}

func LoadAppConfig() AppConfig {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file founnd")
	}

	return AppConfig{
		Port: os.Getenv("PORT"),
	}
}