const Transaction = require("./models/transaction.model");
const TransactionProducer = require("../producer/transactionProducer");
const connectDB = require("./db");
const { Kafka } = require("kafkajs");

connectDB();

class TransactionConsumer extends EventEmitter {
  constructor() {
    super();

    this.kafka = new Kafka({
      clientId: "transaction-consumer",
      brokers: ["localhost:9092"],
    });
    this.consumer = this.kafka.consumer({ groupId: "transaction-group" });
  }

  async connect() {
    await this.consumer.connect();
    console.log("Kafka consumer connected.");
    await this.consumer.subscribe({ topic: "transactions", fromBeginning: true });
  }

  async startConsuming() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const transactions = JSON.parse(message.value.toString());

        this.emit("data", transactions);

        try {
          await Transaction.insertMany(transactions);
          console.log(`${transactions.length} transactions saved to the database.`);
        } catch (error) {
          console.error("Error saving transactions:", error);

          setTimeout(async () => {
            try {
              await Transaction.insertMany(transactions);
              console.log(`${transactions.length} transactions retried and saved.`);
            } catch (retryError) {
              console.error("Retry failed:", retryError);
            }
          }, 3000);
        }
      },
    });
  }
}

module.exports = TransactionConsumer;

// Example usage
const consumer = new TransactionConsumer();
consumer.connect()
  .then(() => consumer.startConsuming())
  .catch((error) => console.error("Error in consumer:", error));