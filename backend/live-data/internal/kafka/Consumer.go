package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"live-data/internal/ws"

	"github.com/IBM/sarama"
)

type Consumer struct{}

func (c Consumer) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (c Consumer) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }

func (c Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	fmt.Println("Subscribed to topic:", claim.Topic())

	for message := range claim.Messages() {
		var event map[string]interface{}
		if err := json.Unmarshal(message.Value, &event); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		fmt.Printf("Received message from Kafka (Partition %d, Offset %d): %v\n", message.Partition, message.Offset, event)
		ws.BroadcastMessage(event) // Send message to WebSocket

		session.MarkMessage(message, "")
	}
	return nil
}

func StartConsumer(broker, topic, groupID string) {
	config := sarama.NewConfig()
	config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
	config.Consumer.Offsets.Initial = -2
	config.Consumer.Return.Errors = true
	config.Consumer.Fetch.Min = 1
	config.Consumer.Fetch.Default = 1048576 // Increase fetch size for faster processing
	config.ChannelBufferSize = 1024         // Increase consumer throughput

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

	fmt.Println("Kafka Consumer started - Listening for live transactions...")

	for {
		err := consumerGroup.Consume(ctx, []string{topic}, Consumer{})
		if err != nil {
			fmt.Println("Error consuming from Kafka. Retrying in 3 seconds:", err)
			time.Sleep(3 * time.Second)
		}

		if ctx.Err() != nil {
			return
		}
	}
}
