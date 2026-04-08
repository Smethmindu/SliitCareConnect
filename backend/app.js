import express from "express";
import cors from "cors";

import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Route imports — Counselor component only
import counselorRoutes from "./routes/counselorRoutes.js";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("SliitCareConnect API is running...");
});

// Mount API Routes — Counselor component
app.use("/api/counselors", counselorRoutes);

// API Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

export default app;