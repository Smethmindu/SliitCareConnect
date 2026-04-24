import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

// Start server immediately so the dev proxy doesn't 502.
const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}...`);
});

// Track DB readiness so routes can respond with a useful error.
app.locals.dbReady = false;

connectDB(app);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  try {
    server?.close?.(() => process.exit(1));
  } catch {
    process.exit(1);
  }
});
