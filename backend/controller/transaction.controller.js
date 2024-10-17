import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req,res) => {
    try {
        const transactions = await Transaction.find({});
        res.status(200).json({ success: true, data: transactions});
    } catch (error) {
        console.log(`Error fetching transactions: ${error.message}`);
    }
}