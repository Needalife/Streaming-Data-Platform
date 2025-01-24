const Transaction = require("./models/transaction.model");
const connectDB = require("./db");

async function setupLifecycleStream() {
  try {
    await connectDB();
    console.log("MongoDB connected.");

    const changeStream = Transaction.watch();

    changeStream.on("change", async (change) => {
      console.log("Change detected:", change);

      const recordCount = await Transaction.countDocuments();
      if (recordCount > process.env.MAX_RECORDS) {
        const oldRecords = await Transaction.find()
          .sort({ createdAt: 1 })
          .limit(parseInt(process.env.DELETE_COUNT, 10));

        const idsToDelete = oldRecords.map((record) => record._id);
        await Transaction.deleteMany({ _id: { $in: idsToDelete } });

        console.log(`Deleted ${idsToDelete.length} old records.`);
      } else {
        console.log("No deletion needed.");
      }
    });

    console.log("Lifecycle stream setup complete.");
  } catch (error) {
    console.error("Error in lifecycle stream:", error);
  }
}

(async () => {
  console.log("Starting lifecycle service...");
  await setupLifecycleStream();
})();
