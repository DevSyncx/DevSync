// Entry point of the backend server
require("dotenv").config();
// Removed MongoDB dependency
const express = require("express");
// Removed mongoose dependency
const cors = require("cors");
const path = require("path");
// Commenting out routes that depend on MongoDB
// const contactRouter = require("./routes/contact.route");
const passport = require("passport"); // import actual passport
require("./config/passport"); // just execute the strategy config
const session = require("express-session");


// Importing Rate Limiter Middlewares

const { generalMiddleware, authMiddleware } = require("./middleware/rateLimit/index")



// Initialize express
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // frontend URL for local dev
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(
    session({
        secret: process.env.SESSION_SECRET || "devsync_session_secret",
        resave: false,
        saveUninitialized: true, // Changed to true to maintain session for unauthenticated users
        cookie: { 
            secure: false, // set true if using HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }
    })
);

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


// Route to display the initial message on browser
app.get("/", (req, res) => {
    res.send("DEVSYNC BACKEND API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});