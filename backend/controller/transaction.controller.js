import Transaction from "../models/transaction.model.js";
import mongoose from "mongoose";

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.log(`Error fetching transactions: ${error.message}`);
    }
};

export const getLatestTransactionsByAmount = async (req, res) => {
    try {
        const amount = parseInt(req.query.amount);
        if (!amount || amount < 1) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid amount" });
        }

        const transactions = await Transaction.find()
            .sort({ timestamp: -1 })
            .limit(amount);

        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.log(`Error fetching transactions: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTransactionsByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide both startDate and endDate",
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setUTCHours(23, 59, 59, 999);

        const transactions = await Transaction.find({
            timestamp: {
                $gte: start,
                $lte: end,
            },
        });

        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.log(`Error fetching transactions by date range: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTransactionsByName = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid name",
            });
        }

        // search for name (case-insensitive)
        const transactions = await Transaction.find({
            name: { $regex: name, $options: "i" },
        });

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found with that name",
            });
        }

        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.log(`Error searching transactions by name: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTransactionById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid transaction id" });
    }

    try {
        await Transaction.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Transaction deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
        console.log(`Error deleting transaction: ${error}`);
    }
};

// download transaction as a .txt file
export const downloadTransactionById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid transaction id" });
    }

    try {
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        const transactionJson = {
            transaction_id: transaction._id,
            name: transaction.name,
            type: transaction.type,
            status: transaction.status,
            email: transaction.email,
            timestamp: new Date(transaction.timestamp).toISOString(),
        };

        res.setHeader('Content-disposition', `attachment; filename=transaction_${transaction._id}.json`);
        res.setHeader('Content-type', 'text/plain');
        res.send(JSON.stringify(transactionJson, null, 2));
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
        console.log(`Error downloading transaction: ${error}`);
    }
};

export const sse = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();  // Flush headers to establish the connection

    const changeStream = Transaction.watch();

    changeStream.on('change', (change) => {
        // Send only insert operations as SSE events
        if (change.operationType === 'insert') {
            res.write(`data: ${JSON.stringify(change.fullDocument)}\n\n`);
        }
    });

    req.on('close', () => {
        // console.log('SSE client disconnected');
        if (!changeStream.closed) {
            changeStream.close();
        }
    });
};

export const getRecentTransactions = async (req, res) => {
    try {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        const transactions = await Transaction.find({
            timestamp: { $gte: twoHoursAgo }
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, data: transactions });
    } catch (error) {
        console.error(`Error fetching recent transactions: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};