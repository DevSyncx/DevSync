// Entry point of the backend server
require('dotenv').config();
const dbconnection = require('./db/connection');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(express.json());

// Session middleware (needed for passport)
app.use(
  session({
    secret: "devsync_secret_key", // keep this in .env in production
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you can save/find the user in DB
      console.log("Google profile:", profile);
      return done(null, profile);
    }
  )
);

// Serialize & deserialize user (for session)
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('DEVSYNC BACKEND API');
});

// 🔑 Google Auth Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 🔑 Google Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Redirect back to frontend (React) after successful login
    res.redirect("http://localhost:5173/dashboard");
  }
);

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});