const Transaction = require("../models/transaction.model");
const connectDB = require("./db");

connectDB();

const MAX_RECORDS = process.env.MAX_RECORDS || 5000;
const DELETE_COUNT = process.env.DELETE_COUNT || 100;

async function setupLifecycleStream() {
  try {
    const changeStream = Transaction.watch();

    changeStream.on("change", async (change) => {
      console.log("Change detected:", change);

      const recordCount = await Transaction.countDocuments();
      if (recordCount > MAX_RECORDS) {
        const oldRecords = await Transaction.find()
          .sort({ createdAt: 1 })
          .limit(DELETE_COUNT);

        const idsToDelete = oldRecords.map((record) => record._id);
        await Transaction.deleteMany({ _id: { $in: idsToDelete } });

        console.log(`Deleted ${DELETE_COUNT} old records.`);
      }
    });
  } catch (error) {
    console.error("Error in lifecycle stream:", error);
  }
}

module.exports = setupLifecycleStream;
