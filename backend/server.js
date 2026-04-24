/**
 * MAIN SERVER ENTRY POINT
 * This file initializes the environment, connects to the database, and starts the Express server.
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

// Load environment variables from .env file
dotenv.config();

// Determine the port from environment variables or default to 3000
const port = Number(process.env.PORT) || 3000;

/**
 * START SERVER
 * We listen immediately to prevent the frontend proxy from timing out while we connect to the DB.
 * This ensures the student dashboard doesn't show a blank white page if the DB takes 5s to wake up.
 */
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}...`);
});

// Track DB readiness so routes can respond with a useful error.
app.locals.dbReady = false;

/**
 * DATABASE CONNECTION
 * Asynchronously connect to MongoDB using Mongoose.
 * If connection fails, the server stays up but 'dbReady' is set to false.
 */
const connectDB = async () => {
  try {
    // Fallback connection string provided for development convenience
    const mongoString =
      process.env.MONGO_URI ||
      process.env.MONGO_STRING ||
      'mongodb+srv://smethmindu_db_user:aInUauTAwOTo24r8@cluster0.aivy9fh.mongodb.net/counseling_platform?retryWrites=true&w=majority&appName=Cluster0';

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoString);

    app.locals.dbReady = true;
    console.log('✅ MongoDB connection successful');
  } catch (error) {
    app.locals.dbReady = false;
    console.error('❌ MongoDB connection error:', error?.message || error);
    // Do NOT exit: keep API reachable to avoid frontend 502s.
  }
};

// Execute connection
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  try {
    server?.close?.(() => process.exit(1));
  } catch {
    process.exit(1);
  }
});
