const Transaction = require("../models/transaction.model.js");

const MAX_RECORDS = process.env.MAX_RECORDS || 5000;
const DELETE_COUNT = process.env.DELETE_COUNT || 100;

async function manageLifecycle() {
  try {
    const recordCount = await Transaction.countDocuments();

    if (recordCount > MAX_RECORDS) {
      const oldRecords = await Transaction.find()
        .sort({ createdAt: 1 })
        .limit(DELETE_COUNT);

      const idsToDelete = oldRecords.map((record) => record._id);
      await Transaction.deleteMany({ _id: { $in: idsToDelete } });

      console.log(
        `Deleted ${DELETE_COUNT} old records to maintain lifecycle constraints.`
      );
    } else {
      console.log("No lifecycle maintenance needed.");
    }
  } catch (error) {
    console.error("Error managing lifecycle:", error);

    setTimeout(manageLifecycle, 3000);
  }
}

module.exports = manageLifecycle;
