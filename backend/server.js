require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const resourceRoutes = require("./routes/resource.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const quizRoutes = require("./routes/quiz.routes");

const app = express();

// ✅ Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
}));
app.use(express.json());

// ✅ Static folder for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Connect DB
connectDB();

// ✅ Test route
app.get("/", (req, res) => res.send("API Running"));

// ✅ Routes
app.use("/api/resources", resourceRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/quiz", quizRoutes);

// ❌ Blog removed (since you don’t need it)

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Triggered nodemon