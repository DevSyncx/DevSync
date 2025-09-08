// Entry point of the backend server
require("dotenv").config();   // Load .env first
const express = require("express");
const mongoose = require("mongoose"); // Import mongoose BEFORE using it
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport"); 
require("./config/passport"); // execute passport strategy config
const contactRouter = require("./routes/contact.route");

// ------------------------
// MongoDB Connection
// ------------------------
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Error: MONGO_URI not defined in .env file!");
  process.exit(1);
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch((err) => console.error("MongoDB connection error:", err));

// ------------------------
// Initialize Express
// ------------------------
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "devsync_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set true if using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------------
// Define Routes
// ------------------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/contact", contactRouter);

// server.js (somewhere after other app.use(...) lines)
app.use("/api/chatbot", require("./routes/chatbot.route"));


// Route to display the initial message
app.get("/", (req, res) => {
  res.send("DEVSYNC BACKEND API");
});

// ------------------------
// Start Server
// ------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});
