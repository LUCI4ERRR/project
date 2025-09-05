const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const chatbotController = require('../controllers/chatbotController');

// Define the chat route
router.post('/chat', authenticateUser, chatbotController.handleChat);

module.exports = router;