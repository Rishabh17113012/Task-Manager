import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(MONGO_URI); // Removed deprecated options
        isConnected = db.connection.readyState === 1;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw new Error("Failed to connect to MongoDB");
    }
};
