package events

import (
	"fmt"
	"github.com/IBM/sarama"
)

func SendMessage(producer sarama.SyncProducer, topic string, message string) {
	msg := &sarama.ProducerMessage {
		Topic: topic,
		Value: sarama.StringEncoder(message),
	}

	partition, offset, err := producer.SendMessage(msg)
	if err != nil {
		fmt.Printf("Fail to send message: %v \n", msg)
		return
	}
	fmt.Println(message)
	fmt.Printf("Message sent successfully to partition %d, offset %d \n", partition, offset)
}