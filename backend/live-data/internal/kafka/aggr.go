package kafka

import (
	"time"

	"live-data/internal/ws"
)

func startAggregation() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		mutex.Lock()
		if len(transactionBuffer) == 0 {
			mutex.Unlock()
			continue
		}

		dataToAggregate := transactionBuffer
		transactionBuffer = nil
		mutex.Unlock()

		ws.BroadcastStructuredData(aggregateTransactions(dataToAggregate))
	}
}

func aggregateTransactions(transactions []map[string]interface{}) map[string]interface{} {
	summary := map[string]int{
		"totalTransactions":   0,
		"successTransactions": 0,
		"failedTransactions":  0,
		"ongoingTransactions": 0,
	}

	for _, txn := range transactions {
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

	summary["totalTransactions"] = summary["successTransactions"] + summary["failedTransactions"] + summary["ongoingTransactions"]
	summary["timestamp"] = int(time.Now().Unix())

	return map[string]interface{}{
		"summary": summary,
	}
}
