package kafka

import (
	"encoding/json"
	"fmt"
	"github.com/IBM/sarama"
	"log"
	"static-data/db"
	"time"
)

func StartConsumer(brokers []string, topic string) {
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true

	master, err := sarama.NewConsumer(brokers, config)
	if err != nil {
		log.Fatalf("Error creating consumer: %v", err)
	}
	defer master.Close()

	consumer, err := master.ConsumePartition(topic, 0, sarama.OffsetNewest)
	if err != nil {
		log.Fatalf("Error consuming partition: %v", err)
	}
	defer consumer.Close()

	log.Printf("Started consuming from topic: %s", topic)

	for msg := range consumer.Messages() {
		var data map[string]interface{}
		if err := json.Unmarshal(msg.Value, &data); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		dateCollection := "collection_" + time.Now().Format("2006-01-02")
		db.SaveData("static_data", dateCollection, data)
		fmt.Printf("Message consumed: %v\n", data)
	}
}
