import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./db/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
