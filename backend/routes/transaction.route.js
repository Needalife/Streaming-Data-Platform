import express from "express";
import {
    getAllTransactions,
    getLatestTransactionsByAmount,
    getTransactionsByDate,
} from "../controller/transaction.controller.js";

const router = express.Router();

router.get('/all',getAllTransactions);

router.get('/latest',getLatestTransactionsByAmount);

router.get('/date-range',getTransactionsByDate);

export default router;