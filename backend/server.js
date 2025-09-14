// Entry point of the backend server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));

// Initialize Passport
app.use(passport.initialize());

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('DEVSYNC BACKEND API');
});

// Auth routes
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});