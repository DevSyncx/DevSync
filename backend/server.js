// Entry point of the backend server
require("dotenv").config();
const dbconnection = require("./db/connection");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const contactRouter = require("./routes/contact.route");
const passport = require("passport"); // import actual passport
require("./config/passport"); // just execute the strategy config
const session = require("express-session");




// Initialize express
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL|| "http://localhost:5173", // frontend URL for local dev
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

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/contact", contactRouter);

// Route to display the initial message on browser
app.get("/", (req, res) => {
  res.send("DEVSYNC BACKEND API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});
