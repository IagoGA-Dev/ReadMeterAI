import Mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const conn = await Mongoose.connect(process.env.MONGO_URI || "mongodb://localhost", {
      dbName: process.env.MONGO_DB || "test_db",
      user: process.env.MONGO_USER || "root",
      pass: process.env.MONGO_PASS || "root",
    }).then(() => {
      console.log("Connected to MongoDB");
    }).catch((err) => {
      console.error(err);
    });

    Mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to db");
    });

    Mongoose.connection.on("error", (err) => {
      console.error(err);
    });

    Mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

  }
  catch (err) {
    console.error(err);
  }
}