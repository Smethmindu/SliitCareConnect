import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

const app = express();

// Configure CORS to allow frontend
const corsOptions = {
  // Allow requests from the frontend dev server.
  // Using a dynamic origin callback avoids CORS issues across different ports.
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
// Explicitly handle CORS preflight requests (browser sends OPTIONS before POST).
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// Helpful health endpoints for dev/proxy debugging
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    dbReady: Boolean(app.locals.dbReady),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;