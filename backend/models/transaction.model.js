import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
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
        type: Date,
        required: true,
      }
});

const Transaction = mongoose.model("Transaction", transactionSchema, "transactions");

export default Transaction;
