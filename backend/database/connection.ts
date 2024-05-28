import mongoose from "mongoose";

export async function dbConn() {
  try {
    await mongoose.connect("mongodb://localhost:27017/quiz-game");

    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
