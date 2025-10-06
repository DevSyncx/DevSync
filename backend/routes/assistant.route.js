const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { postAssistantMessage, getAssistantNudge } = require('../controllers/assistant.controller');

// POST /api/assistant/message -> returns assistant reply
router.post('/message', auth, postAssistantMessage);

// GET /api/assistant/nudge -> small tip/motivation
router.get('/nudge', auth, getAssistantNudge);

module.exports = router;


