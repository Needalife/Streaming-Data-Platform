import express from "express";
import {
    deleteTransactionById,
    getAllTransactions,
    getLatestTransactionsByAmount,
    getTransactionsByDate,
    getTransactionsByName,
    downloadTransactionById
} from "../controller/transaction.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all", getAllTransactions);

router.get("/latest", getLatestTransactionsByAmount);

router.get("/date-range", getTransactionsByDate);

router.get('/search', getTransactionsByName);

router.get('/:id/download', downloadTransactionById);

router.delete('/:id', deleteTransactionById);

export default router;
