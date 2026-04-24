/**
 * EXPRESS APPLICATION CONFIGURATION
 * This file sets up the middleware, static files, and routes for the entire API.
 */
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// --- MEMBER 3: Booking & Notifications ---
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// --- MEMBER 1: Auth & User Management ---
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import chatbotRoutes from "./routes/chatbotRoutes.js";

// --- MEMBER 2: Counselor Components ---
import counselorRoutes from "./routes/counselorRoutes.js";

// --- MEMBER 4: Resources, Feedback, Quiz & Messages ---
import resourceRoutes from "./routes/resource.routes.js";
import feedbackRoutes from "./routes/feedback.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * MIDDLEWARE SETUP
 * CORS: Allows the frontend to communicate with this backend.
 * JSON: Parses incoming JSON request bodies.
 */
const corsOptions = {
  origin: (origin, callback) => callback(null, true), // Dynamic origin allowance
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// ✅ Static folder for uploaded files
// This allows students to view/download PDFs and images uploaded by counselors.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- ROUTE MOUNTING ---
// The API is modularly split to correspond with the 4 development members' tasks.

// Member 3 Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

// Member 1 Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/chat", chatbotRoutes);

// Member 2 Routes
app.use("/api/counselors", counselorRoutes);

// Member 4 Routes
app.use("/api/resources", resourceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/messages", messageRoutes);

// System Routes
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    dbReady: Boolean(app.locals.dbReady),
  });
});

app.get("/", (req, res) => {
  res.send("SliitCareConnect API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;