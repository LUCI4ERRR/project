const mongoose = require('mongoose');

// Part 1: Define the schema for a single Comment.
// This is not a separate model, but a blueprint for sub-documents.
const CommentSchema = new mongoose.Schema({
    // A reference to the User who wrote the comment.
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    // The actual text of the comment.
    text: {
        type: String,
        required: [true, 'Comment text is required'],
    },
    // We store the user's name directly on the comment.
    // This is a performance optimization to avoid looking up the user's name every time we display comments.
    name: {
        type: String,
        required: true
    }
}, {
    // Adds `createdAt` and `updatedAt` timestamps to each comment.
    timestamps: true
});


// Part 2: Define the main schema for a Forum Post.
const PostSchema = new mongoose.Schema({
    // A reference to the User who created the post.
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    // The title of the forum post.
    title: {
        type: String,
        required: [true, 'Please provide a title for your post'],
    },
    // The main body text of the post.
    text: {
        type: String,
        required: [true, 'Please provide text for your post'],
    },
    // This is an array that will hold all the comments.
    // Each object in this array must follow the structure of the CommentSchema.
    comments: [CommentSchema]
}, { 
    // Adds `createdAt` and `updatedAt` timestamps to the post itself.
    timestamps: true 
});

module.exports = mongoose.model('Post', PostSchema);

