// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import session from "express-session";
import passport from "passport";
import { fileURLToPath } from "url";

import feedbackRoutes from "./routes/feedback.route.js";
import contactRouter from "./routes/contact.route.js";
import profileRoutes from "./routes/profile.js";
// import authRoutes from "./routes/auth.js"; // enable when ready

import { generalMiddleware, authMiddleware } from "./middleware/rateLimit/index.js";
import "./config/passport.js"; // configure passport strategies

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsync_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/feedback", feedbackRoutes);
// app.use("/api/auth", authMiddleware, authRoutes); // enable when ready
app.use("/api/profile", generalMiddleware, profileRoutes);
app.use("/api/contact", generalMiddleware, contactRouter);

// Root route
app.get("/", (req, res) => {
  res.send("DEVSYNC BACKEND API");
});

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
