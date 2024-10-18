import Transaction from "../models/transaction.model.js";

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
      return res
        .status(400)
        .json({
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
