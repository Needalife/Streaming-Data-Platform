package cfg

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type KafkaConfig struct {
	Broker string
	Topic  string
}

func LoadKafkaConfig() KafkaConfig {
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	return KafkaConfig{
		Broker: os.Getenv("KAFKA_BROKER"),
		Topic: os.Getenv("KAFKA_TOPIC"),
	}
}