import { Kafka, logLevel } from "kafkajs";

// Kafka configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || "transactions",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  logLevel: logLevel.INFO,
});

// Export Kafka instance
export default kafka;
