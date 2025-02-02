package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"static-data/db"
	"syscall"
	"time"

	"github.com/IBM/sarama"
	"go.mongodb.org/mongo-driver/mongo"
)

type Consumer struct {
	MongoClient *mongo.Client
}

func (c Consumer) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (c Consumer) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }

func (c Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for message := range claim.Messages() {
		var data map[string]interface{}
		if err := json.Unmarshal(message.Value, &data); err == nil {
			collection := "collection_" + time.Now().Format("2006-01-02")
			db.SaveData(c.MongoClient, "static_data", collection, data)
			session.MarkMessage(message, "")
		}
	}
	return nil
}

func StartConsumer(broker, topic, groupID string, client *mongo.Client) {
	consumerGroup := ConnectKafka(broker)
	defer consumerGroup.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		sigchan := make(chan os.Signal, 1)
		signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)
		<-sigchan
		fmt.Println("Shutting down gracefully...")
		cancel()
	}()

	for {
		if err := consumerGroup.Consume(ctx, []string{topic}, Consumer{MongoClient: client}); err != nil {
			log.Fatalf("Error consuming: %v", err)
		}

		if ctx.Err() != nil {
			return
		}
	}
}
