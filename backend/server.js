import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import transactionRoutes from "./routes/transaction.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/transactions", transactionRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});
