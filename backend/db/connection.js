// Initiate connection to MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

// Only connect to MongoDB if MONGODB_URI is provided and not testing mode
const dburl = process.env.MONGODB_URI;
if (dburl && process.env.NODE_ENV !== 'test-auth') {
  mongoose.connect(dburl).then(() => {
      console.log("Connected to DB Successfully ");
  }).catch((err) => {
      console.log("MongoDB connection error:", err.message);
      console.log("Continuing without MongoDB for authentication testing...");
  });
} else {
  console.log("MongoDB connection skipped for authentication testing");
}
