// Entry point of the backend server
require("dotenv").config();

// Dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const passport = require("passport");
const session = require("express-session");

// Passport config with error handling
try {
  require("./config/passport");
} catch (err) {
  console.warn("Google OAuth is not configured properly. Skipping Passport strategy.");
}


// Import routes
// Only include contactRouter if needed - commenting it out as it depends on MongoDB
// const contactRouter = require("./routes/contact.route");

// Rate limiter middleware
const { generalMiddleware, authMiddleware } = require("./middleware/rateLimit/index");


// Initialize Express
const app = express();

// JSON parsing
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL for local dev
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsync_session_secret",
    resave: false,
    saveUninitialized: true, // True to maintain session for unauthenticated users
    cookie: { 
      secure: false, // set true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define routes

// Mount auth routes at both /api/auth and /auth to support both paths
app.use("/api/auth", authMiddleware, require("./routes/auth"));
// Special mount for GitHub OAuth to match GitHub app configuration
app.use("/auth", authMiddleware, require("./routes/auth"));

// Profile route - now supports non-MongoDB users
app.use("/api/profile", generalMiddleware, require("./routes/profile"));

// GitHub routes have been removed, only using GitHub for authentication
// Comment out routes that depend on MongoDB
// app.use("/api/contact", generalMiddleware, contactRouter);


// Default route
app.get("/", (req, res) => {
  res.send("DEVSYNC BACKEND API 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});