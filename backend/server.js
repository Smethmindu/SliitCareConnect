import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

// Start server immediately so the dev proxy doesn't 502.
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}...`);
});

// Track DB readiness so routes can respond with a useful error.
app.locals.dbReady = false;

const connectDB = async () => {
  try {
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
