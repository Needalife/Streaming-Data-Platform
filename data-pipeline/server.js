const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Service running on http://localhost:${PORT}`);
});
