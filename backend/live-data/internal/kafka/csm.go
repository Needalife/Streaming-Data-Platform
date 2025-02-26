package kafka

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"live-data/internal/ws"

	"github.com/IBM/sarama"
)

type Consumer struct{}

var (
	mutex             = sync.Mutex{}
	transactionBuffer []map[string]interface{}
)

func (c Consumer) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (c Consumer) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }

func (c Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	fmt.Println("Subscribed to topic:", claim.Topic())

	go startAggregation()

	for message := range claim.Messages() {
		handleMessage(message, session)
	}

	return nil
}

func handleMessage(message *sarama.ConsumerMessage, session sarama.ConsumerGroupSession) {
	var event map[string]interface{}
	if err := json.Unmarshal(message.Value, &event); err != nil {
		log.Printf("Error decoding message: %v", err)
		return
	}

	mutex.Lock()
	transactionBuffer = append(transactionBuffer, event)
	mutex.Unlock()

	ws.BroadcastRawMessage(event)
	session.MarkMessage(message, "")
}

func StartConsumer(broker, topic, groupID string) {
	config := sarama.NewConfig()
	config.Consumer.Offsets.Initial = -2
	config.Consumer.Return.Errors = true
	config.Consumer.Fetch.Min = 1
	config.Consumer.Fetch.Default = 1048576
	config.ChannelBufferSize = 1024

	consumerGroup, err := sarama.NewConsumerGroup([]string{broker}, groupID, config)
	if err != nil {
		log.Fatalf("Error creating Kafka consumer group: %v", err)
	}
	defer consumerGroup.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go handleShutdown(cancel)

	fmt.Println("Kafka Consumer started - Listening for live transactions...")

	for {
		if err := consumerGroup.Consume(ctx, []string{topic}, Consumer{}); err != nil {
			fmt.Println("Error consuming from Kafka. Retrying in 3 seconds:", err)
			time.Sleep(3 * time.Second)
		}

		if ctx.Err() != nil {
			return
		}
	}
}

func handleShutdown(cancel context.CancelFunc) {
	sigchan := make(chan os.Signal, 1)
	signal.Notify(sigchan, syscall.SIGINT, syscall.SIGTERM)
	<-sigchan
	fmt.Println("Shutting down Kafka consumer gracefully...")
	cancel()
}
