const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const journalController = require('../controllers/journalController');

router.post('/add', authenticateUser, journalController.addJournalEntry);
router.get('/all', authenticateUser, journalController.getJournalEntries);

module.exports = router;