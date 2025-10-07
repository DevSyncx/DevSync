// Entry point of the backend server
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
require("./utils/leetcodeCron");
const passport = require("passport");
const githubRoute = require("./routes/github.route");


// Database connection
require("./db/connection");

// Passport config (optional Google OAuth)
try {
  require("./config/passport");
} catch (err) {
  console.warn("Google OAuth is not configured properly. Skipping Passport strategy.");
}

// Import routes
const contactRouter = require("./routes/contact.route");

// Rate limiter middleware placeholders
const { generalMiddleware, authMiddleware } = require("./middleware/rateLimit/index");

// Initialize Express
const app = express();

// JSON parsing
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsync_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set true if using HTTPS
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// OAuth Routes (mounted at root to match Google's callback URL)
app.use("/auth", require("./routes/auth"));
app.use("/api/github", githubRoute);
// API Routes
app.use("/api/auth", authMiddleware, require("./routes/auth"));
app.use("/api/profile", generalMiddleware, require("./routes/profile"));
app.use("/api/contact", generalMiddleware, contactRouter);


// Default route
app.get("/", (req, res) => {
  res.send("DEVSYNC BACKEND API 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});
