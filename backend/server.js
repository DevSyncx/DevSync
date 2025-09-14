// Entry point of the backend server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET || 'your_default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

// Initialize Passport
app.use(passport.initialize());

// Route to display the initial message on browser
app.get('/', (req, res) => {
  res.send('DEVSYNC BACKEND API');
});

// Auth routes
app.use('/auth', authRoutes);

// Example of a protected route
app.get('/api/profile', authenticate, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running at http://localhost:${PORT} 🚀`);
});