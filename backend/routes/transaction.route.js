import express from "express";
import {
    getAllTransactions,
} from "../controller/transaction.controller.js";

const router = express.Router();

router.get('/',getAllTransactions);

export default router;