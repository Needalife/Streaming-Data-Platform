const Transaction = require("./models/transaction.model");
const connectDB = require("./db");
const { Kafka } = require("kafkajs");
const EventEmitter = require("events");
const express = require("express");

class TransactionConsumer extends EventEmitter {
  constructor() {
    super();

    this.kafka = new Kafka({
      clientId: "transaction-consumer",
      brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
      connectionTimeout: 5000, // Retry after 5 seconds
      retry: {
        retries: 5, // Retry connection 5 times before failing
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: "transaction-group",
      sessionTimeout: 30000, // 30 seconds session timeout
      heartbeatInterval: 10000, // 10 seconds heartbeat interval
    });
  }

  async connect() {
    try {
      await connectDB();
      console.log("MongoDB connected.");

      let connected = false;
      const maxRetries = 5;
      let attempts = 0;

      while (!connected && attempts < maxRetries) {
        try {
          await this.consumer.connect();
          connected = true;
          console.log("Kafka consumer connected.");
        } catch (error) {
          attempts++;
          console.error(
            `Kafka consumer connection attempt ${attempts} failed:`,
            error.message
          );
          if (attempts >= maxRetries) {
            throw new Error(
              "Failed to connect to Kafka after multiple attempts."
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait before retrying
        }
      }

      await this.consumer.subscribe({
        topic: "transactions",
        fromBeginning: true,
      });
      console.log("Subscribed to topic: transactions");
    } catch (error) {
      console.error("Error connecting consumer:", error.message);
      process.exit(1); // Exit process on critical failure
    }
  }

  async startConsuming() {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const transaction = JSON.parse(message.value.toString());

          this.emit("data", transaction);

          try {
            await Transaction.create(transaction);
            console.log(`Transaction saved: ${JSON.stringify(transaction)}`);
          } catch (error) {
            console.error("Error saving transaction:", error.message);
          }
        },
      });
    } catch (error) {
      console.error("Error during consumption:", error.message);
    }
  }

  async disconnect() {
    try {
      await this.consumer.disconnect();
      console.log("Kafka consumer disconnected.");
    } catch (error) {
      console.error("Error disconnecting Kafka consumer:", error.message);
    }
  }
}

(async () => {
  const app = express();
  const consumer = new TransactionConsumer();

  // Health check endpoint
  app.get("/health", (req, res) => {
    const health = {
      kafkaConnected: !!consumer.consumer.isConnected(),
      isConsuming: consumer.isConsuming,
    };
    res.status(200).json(health);
  });

  await consumer.connect();
  consumer.startConsuming();

  const PORT = process.env.CONSUMER_PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Consumer service running on port ${PORT}`);
  });
})();