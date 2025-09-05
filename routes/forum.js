const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const forumController = require('../controllers/forumController');

router.post('/posts', authenticateUser, forumController.createForumPost);
router.get('/posts', forumController.getForumPosts); // No authentication needed for viewing posts

module.exports = router;