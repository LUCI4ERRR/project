const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Register route
router.post('/register', authController.createUser);

// Login route
router.post('/login', authController.loginUser);

module.exports = router;