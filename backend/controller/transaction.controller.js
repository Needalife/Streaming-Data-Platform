import Transaction from "../models/transaction.model.js";

export const getAllTransactions = async (req,res) => {
    try {
        const transactions = await Transaction.find({});
        res.status(200).json({ success: true, data: transactions});
    } catch (error) {
        console.log(`Error fetching transactions: ${error.message}`);
    }
}

export const getLatestTransactionsByAmount = async (req, res) => {
    try {
        const amount = parseInt(req.query.amount, 10); 
        if (!amount || amount < 1) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const transactions = await Transaction.find().sort({ timestamp: -1 }).limit(amount);
        
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.log(`Error fetching transactions: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
