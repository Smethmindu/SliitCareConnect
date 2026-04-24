import mongoose from 'mongoose';

const connectDB = async (app) => {
  try {
    const mongoString =
      process.env.MONGO_URI ||
      process.env.MONGO_STRING ||
      'mongodb+srv://smethmindu_db_user:aInUauTAwOTo24r8@cluster0.aivy9fh.mongodb.net/counseling_platform?retryWrites=true&w=majority&appName=Cluster0';

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(mongoString);

    if (app && app.locals) {
      app.locals.dbReady = true;
    }
    console.log('✅ MongoDB connection successful');
  } catch (error) {
    if (app && app.locals) {
      app.locals.dbReady = false;
    }
    console.error('❌ MongoDB connection error:', error?.message || error);
    // Do NOT exit: keep API reachable to avoid frontend 502s.
  }
};

export default connectDB;