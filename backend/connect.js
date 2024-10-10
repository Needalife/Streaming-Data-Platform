
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const db_username = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD

const uri = `mongodb+srv://${db_username}:${db_password}@clusterkafkaconsumer.2esen.mongodb.net/?retryWrites=true&w=majority&appName=ClusterKafkaConsumer"`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database

module.exports = {
    connectToServer: () => {
        database = client.db(process.env.PROJECT_NAME)
    },
    getDb: () => {
        return database
    }
}