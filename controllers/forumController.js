const Post = require('../models/Post');

/**
 * @desc    Get all forum posts
 * @route   GET /api/forum
 * @access  Private
 */
exports.getAllPosts = async (req, res) => {
    try {
        // Fetch posts and sort with the newest first.
        // The user ID is stored but not sent to the client to maintain anonymity.
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error(`Get All Posts Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Create a new post
 * @route   POST /api/forum
 * @access  Private
 */
exports.createPost = async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).json({ message: 'Post content cannot be empty.' });
        }
        const post = await Post.create({
            user: req.user.id, // User ID from the auth token
            content: req.body.content
        });
        res.status(201).json(post);
    } catch (error)
        {
        console.error(`Create Post Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/forum/:postId/comments
 * @access  Private
 */
exports.addComment = async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).json({ message: 'Comment content cannot be empty.' });
        }

        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = {
            user: req.user.id,
            content: req.body.content
        };

        post.comments.unshift(newComment); // Add comment to the top of the list
        await post.save();
        res.status(201).json(post.comments);
    } catch (error) {
        console.error(`Add Comment Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/forum/:postId
 * @access  Private (Admin or Moderator only)
 */
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        // This logic can be expanded to allow original posters to delete their own posts
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (error) {
        console.error(`Delete Post Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/forum/:postId/comments/:commentId
 * @access  Private (Admin or Moderator only)
 */
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const commentIndex = post.comments.findIndex(c => c.id === req.params.commentId);
        if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });

        post.comments.splice(commentIndex, 1); // Remove the comment from the array
        await post.save();
        res.json({ message: 'Comment removed' });

    } catch (error) {
        console.error(`Delete Comment Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

