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
 
