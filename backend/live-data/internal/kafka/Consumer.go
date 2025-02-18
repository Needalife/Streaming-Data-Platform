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
	mutex         = sync.Mutex{}
	transactionBuffer []map[string]interface{}
)

func (c Consumer) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (c Consumer) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }

func (c Consumer) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	fmt.Println("Subscribed to topic:", claim.Topic())

	// Start periodic aggregation in a separate Goroutine
	go startAggregation()

	for message := range claim.Messages() {
		var event map[string]interface{}
		if err := json.Unmarshal(message.Value, &event); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		// Add transaction to buffer
		mutex.Lock()
		transactionBuffer = append(transactionBuffer, event)
		mutex.Unlock()

		ws.BroadcastRawMessage(event)

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

// Periodically aggregates and broadcasts messages
func startAggregation() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		mutex.Lock()
		if len(transactionBuffer) == 0 {
			mutex.Unlock()
			continue
		}

		// Copy buffer and clear original
		aggregatedData := aggregateTransactions(transactionBuffer)
		transactionBuffer = nil
		mutex.Unlock()

		// **Broadcast aggregated structured data**
		ws.BroadcastStructuredData(aggregatedData)
	}
}

// Aggregate transactions into structured format
func aggregateTransactions(transactions []map[string]interface{}) map[string]interface{} {
    summary := map[string]int{
        "totalTransactions":     0,
        "successTransactions":   0,
        "failedTransactions":    0,
        "ongoingTransactions":   0,
    }

    for _, txn := range transactions {
        summary["totalTransactions"]++

        fullDoc, exists := txn["fullDocument"].(map[string]interface{})
        if !exists {
            continue
        }

        status, ok := fullDoc["status"].(string)
        if !ok {
            continue
        }

        switch status {
        case "completed":
            summary["successTransactions"]++
        case "failed":
            summary["failedTransactions"]++
        case "pending":
            summary["ongoingTransactions"]++
        }
    }

    summary["timestamp"] = int(time.Now().Unix())

    return map[string]interface{}{
        "summary": summary,
    }
}
