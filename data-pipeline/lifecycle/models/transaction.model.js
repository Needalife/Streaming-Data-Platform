const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      required: true,
      enum: ["USD", "EUR", "GBP", "VND", "JPY"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
    },
    type: {
      type: String,
      required: true,
      enum: ["withdraw", "deposit", "transfer", "payment"],
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
