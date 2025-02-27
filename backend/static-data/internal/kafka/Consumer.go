package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"static-data/internal/db"
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
		var event map[string]interface{}
		if err := json.Unmarshal(message.Value, &event); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		if fullDoc, exists := event["fullDocument"].(map[string]interface{}); exists {
			delete(fullDoc, "__v")

			collection := "collection_" + time.Now().Format("2006-01-02")
			db.SaveData(c.MongoClient, "static_data", collection, fullDoc)
			fmt.Printf("Saved document (without __v): %v\n", fullDoc)
		} else {
			log.Println("No fullDocument found in the message.")
		}

		session.MarkMessage(message, "")
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
