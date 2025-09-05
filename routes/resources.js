const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.get('/', resourceController.getResources); // No authentication needed for viewing resources

module.exports = router;