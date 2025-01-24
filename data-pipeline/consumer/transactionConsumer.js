const Transaction = require("./models/transaction.model");
const connectDB = require("./db");
const { Kafka } = require("kafkajs");
const EventEmitter = require("events");

class TransactionConsumer extends EventEmitter {
  constructor() {
    super();

    this.kafka = new Kafka({
      clientId: "transaction-consumer",
      brokers: [process.env.KAFKA_BROKER || "kafka:9092"],
    });
    this.consumer = this.kafka.consumer({ groupId: "transaction-group" });
  }

  async connect() {
    try {
      await connectDB();
      console.log("MongoDB connected.");

      await this.consumer.connect();
      console.log("Kafka consumer connected.");
      await this.consumer.subscribe({
        topic: "transactions",
        fromBeginning: true,
      });
    } catch (error) {
      console.error("Error connecting consumer:", error);
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
            console.error("Error saving transaction:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error during consumption:", error);
    }
  }
}

(async () => {
  const consumer = new TransactionConsumer();
  await consumer.connect();
  await consumer.startConsuming();
})();
