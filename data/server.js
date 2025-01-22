const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./db/db");
const manageLifecycle = require("./lifecycle/lifecycle");
const TransactionProducer = require("./producer/transactionProducer");
const transactionConsumer = require("./consumer/transactionConsumer");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Service is healthy" });
});

const producer = new TransactionProducer();
transactionConsumer(producer);
producer.startProducing();

setInterval(manageLifecycle, 2000);

app.listen(PORT, () => {
  console.log(`Service running on http://localhost:${PORT}`);
});
