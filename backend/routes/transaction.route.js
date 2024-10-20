import express from "express";
import {
    deleteTransactionById,
    getAllTransactions,
    getLatestTransactionsByAmount,
    getTransactionsByDate,
} from "../controller/transaction.controller.js";

const router = express.Router();

router.get('/all', getAllTransactions);

router.get('/latest', getLatestTransactionsByAmount);

router.get('/date-range', getTransactionsByDate);

router.delete('/:id',deleteTransactionById);

export default router;