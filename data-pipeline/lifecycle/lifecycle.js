const express = require("express");
const Transaction = require("./models/transaction.model");
const connectDB = require("./db");

class LifecycleService {
  constructor() {
    this.mongoConnected = false;
    this.isMonitoring = false;
  }

  async setupLifecycleStream() {
    try {
      await connectDB();
      this.mongoConnected = true;
      console.log("MongoDB connected.");

      const changeStream = Transaction.watch();
      this.isMonitoring = true;

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
      this.mongoConnected = false;
      this.isMonitoring = false;
      console.error("Error in lifecycle stream:", error);
    }
  }
}

(async () => {
  const app = express();
  const lifecycle = new LifecycleService();

  // Health check endpoint
  app.get("/health", (req, res) => {
    const health = {
      mongoConnected: lifecycle.mongoConnected,
      isMonitoring: lifecycle.isMonitoring,
    };
    res.status(200).json(health);
  });

  await lifecycle.setupLifecycleStream();

  const PORT = process.env.LIFECYCLE_PORT || 3003;
  app.listen(PORT, () => {
    console.log(`Lifecycle service running on port ${PORT}`);
  });
})();
