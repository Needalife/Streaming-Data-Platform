const Transaction = require("./models/transaction.model");
const TransactionProducer = require("./producer/transactionProducer");
const connectDB = require("./db");

connectDB();

module.exports = (producer) => {
  producer.on("data", async (transactions) => {
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
  });
};

const producer = new TransactionProducer();
transactionConsumer(producer);
