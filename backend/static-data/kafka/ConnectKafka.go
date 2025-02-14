package kafka

import (
	"fmt"
	"github.com/IBM/sarama"
)

func ConnectKafka(broker string) sarama.ConsumerGroup {
	config := sarama.NewConfig()
	config.Version = sarama.V2_1_0_0
	config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRange

	consumerGroup, err := sarama.NewConsumerGroup([]string{broker}, "static-data-group", config)
	if err != nil {
		panic(fmt.Sprintf("Error creating consumer group: %v", err))
	}
	return consumerGroup
}
