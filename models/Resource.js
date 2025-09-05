const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    // The title of the resource.
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true, // Removes whitespace from both ends of a string
    },
    // The type of resource. `enum` ensures it can only be one of these values.
    type: {
        type: String,
        required: [true, 'Please specify the resource type'],
        enum: ['video', 'audio', 'guide'],
    },
    // The main content. This could be a URL (for video/audio) or markdown text (for a guide).
    content: {
        type: String,
        required: [true, 'Content cannot be empty'],
    },
    // The language of the resource, to support regional languages.
    language: {
        type: String,
        default: 'English',
    },
    // A reference to the User (likely an admin or counselor) who created this resource.
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    }
}, { 
    // This option automatically adds `createdAt` and `updatedAt` timestamps.
    timestamps: true 
});

module.exports = mongoose.model('Resource', ResourceSchema);

