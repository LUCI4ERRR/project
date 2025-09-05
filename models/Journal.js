const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    // A reference to the User who created this journal entry.
    // This is the link that keeps the entry private to that user.
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    // The main text content of the journal entry.
    entry: {
        type: String,
        required: [true, 'Journal entry cannot be empty'],
    },
    // A list of predefined moods the user can choose from.
    mood: {
        type: String,
        required: [true, 'Please select a mood'],
        enum: ['happy', 'sad', 'anxious', 'calm', 'neutral', 'stressed', 'excited'],
    }
}, { 
    // This option automatically adds `createdAt` and `updatedAt` fields
    // to track when the entry was created and last modified.
    timestamps: true 
});

module.exports = mongoose.model('Journal', JournalSchema);

