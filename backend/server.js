import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/db.js";
import transactionRoutes from "./routes/transaction.route.js";
import metricsRoutes from './routes/metrics.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.use("/api/transactions", transactionRoutes);
app.use('/api/metrics', metricsRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});
