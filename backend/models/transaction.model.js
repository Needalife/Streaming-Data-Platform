import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: [
    {
      transaction_id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      timestamp: {
        type: String,
        required: true,
      },
    },
  ],
});

const Transaction = mongoose.model("Transaction", transactionSchema, "messages");

export default Transaction;
