// backend/routes/chatbot.route.js
const express = require("express");
const router = express.Router();
const { getChatResponse } = require("../controllers/chatbotController");

// POST /api/chatbot
router.post("/", getChatResponse);

module.exports = router;
