const express = require("express");
const dotenv = require("dotenv");
const TransactionProducer = require("./producer/transactionProducer");
const transactionConsumer = require("./consumer/transactionConsumer");
const setupLifecycleStream = require("./lifecycle/lifecycle");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Service is healthy" });
});

const producer = new TransactionProducer();
transactionConsumer(producer);
producer.startProducing();

// Start the lifecycle management stream
setupLifecycleStream();

app.listen(PORT, () => {
  console.log(`Service running on http://localhost:${PORT}`);
});
