package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"live-data/ws" // Import WebSocket handler

	"github.com/IBM/sarama"
)

type Consumer struct{}

func (c Consumer) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (c Consumer) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }

func (c Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for message := range claim.Messages() {
		var event map[string]interface{}
		if err := json.Unmarshal(message.Value, &event); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		// Broadcast live data to WebSocket clients
		ws.BroadcastMessage(event)

		session.MarkMessage(message, "")
	}
	return nil
}

func StartConsumer(broker, topic, groupID string) {
	config := sarama.NewConfig()
	config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
	config.Consumer.Offsets.Initial = sarama.OffsetNewest

	consumerGroup, err := sarama.NewConsumerGroup([]string{broker}, groupID, config)
	if err != nil {
		log.Fatalf("Error creating Kafka consumer group: %v", err)
	}
	defer consumerGroup.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		sigchan := make(chan os.Signal, 1)
		signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)
		<-sigchan
		fmt.Println("Shutting down Kafka consumer gracefully...")
		cancel()
	}()

	for {
		err := consumerGroup.Consume(ctx, []string{topic}, Consumer{})
		if err != nil {
			log.Fatalf("Error consuming: %v", err)
		}

		if ctx.Err() != nil {
			return
		}
	}
}
