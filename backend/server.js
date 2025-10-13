// Entry point of the backend server
require("dotenv").config();

// Dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
require("./utils/leetcodeCron");
const passport = require("passport");
const githubRoute = require("./routes/github.route");


// Passport config with error handling
try {
  require("./config/passport");
} catch (err) {
  console.warn("Google OAuth is not configured properly. Skipping Passport strategy.");
}

// Rate limiter middleware
const { generalMiddleware, authMiddleware } = require("./middleware/rateLimit/index");

// Initialize Express
const app = express();

// JSON parsing
app.use(express.json());

// CORS preflight handling - respond to OPTIONS requests explicitly
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

// Enable CORS for all other requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
  })
);

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsync_session_secret",
    resave: false,
    saveUninitialized: true, // keep sessions for unauthenticated users
    cookie: {
      secure: false, // set true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
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
// API Routes
app.use("/api/auth", authMiddleware, require("./routes/auth"));
app.use("/auth", authMiddleware, require("./routes/auth"));
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
