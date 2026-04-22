import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';

// Route imports — Counselor component only
import counselorRoutes from "./routes/counselorRoutes.js";

import resourceRoutes from "./routes/resource.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure CORS to allow frontend
const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// ✅ Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

// Mount API Routes - Feature: Resources, Feedback, Quiz
app.use("/api/resources", resourceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat", chatbotRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;