import express from "express";
import {
    getAllTransactions,
    getLatestTransactionsByAmount,
} from "../controller/transaction.controller.js";

const router = express.Router();

router.get('/all',getAllTransactions);

router.get('/latest',getLatestTransactionsByAmount);

export default router;