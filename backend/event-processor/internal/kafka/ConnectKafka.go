package kafka

import (
	"fmt"
	"time"

	"github.com/IBM/sarama"
)

func ConnectKafka(brokers []string) sarama.SyncProducer {
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 5
	config.Producer.Return.Successes = true

	var producer sarama.SyncProducer
	var err error
	const retries = 10

	for i := 0; i < retries; i ++ {
		producer, err = sarama.NewSyncProducer(brokers, config)
		if err == nil {
			fmt.Println("Kafka producer connected!")
			return producer
		}

		fmt.Printf("Fail to connect Kafka producer: %v. Retrying in 5 secs.. \n", err)
		time.Sleep(5 * time.Second)
	}
	
	fmt.Printf("Fail to connect to Kafka after %d retries, error: %v", retries, err)
	return nil
}