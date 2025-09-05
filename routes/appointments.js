const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// Define the routes and apply the authentication middleware
router.post('/book', authenticateUser, appointmentController.bookAppointment);
router.get('/my-appointments', authenticateUser, appointmentController.getMyAppointments);

module.exports = router;