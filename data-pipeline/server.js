const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Service running on http://localhost:${PORT}`);
});
