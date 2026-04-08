import express from "express";
import cors from "cors";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

// Route imports — Counselor component only
import counselorRoutes from "./routes/counselorRoutes.js";

const app = express();

// Configure CORS to allow frontend
const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// API Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    dbReady: Boolean(app.locals.dbReady),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("SliitCareConnect API is running...");
});

// Mount API Routes — Counselor component
app.use("/api/counselors", counselorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;