const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Define the routes and apply authentication
router.get('/analytics', authenticateUser, adminController.getAnalytics);

module.exports = router;