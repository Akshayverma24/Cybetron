
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI in your .env.local file"
  );
}

// Cache MongoDB connection during Next.js hot reload
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((instance) => {
        console.log("✅ MongoDB Connected Successfully");
        console.log(
          "📁 Database Name:",
          mongoose.connection.name
        );
        console.log(
          "🌐 Database Host:",
          mongoose.connection.host
        );

        return instance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }

  return cached.conn;
}

export default connectDB;
