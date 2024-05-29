import { ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

export async function dbConn() {
  const host = process.env.MONGO_HOST;
  const name = process.env.MONGO_NAME;

  const user = process.env.MONGO_USER;
  const password = process.env.MONGO_PASSWORD;

  const uri = `mongodb+srv://${user}:${password}@${host}/?retryWrites=true&w=majority&appName=${name}`;

  try {
    // await mongoose.connect("mongodb://localhost:27017/quiz-game");
    await mongoose.connect(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
