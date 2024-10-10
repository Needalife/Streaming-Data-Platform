const express = require("express")
const cors = require("cors")
const connect = require("./connect")
require('dotenv').config({ path: './config.env' });

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})