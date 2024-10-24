import mongoose from "mongoose";

let sendEventToAll;

export const setSSEFunction = (fn) => {
  sendEventToAll = fn;
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const transactionCollection = conn.connection.collection("transactions");
    const changeStream = transactionCollection.watch();

    changeStream.on("change", (change) => {
      console.log("Change detected:", change);
      if (sendEventToAll) {
        sendEventToAll(change);
      }
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};