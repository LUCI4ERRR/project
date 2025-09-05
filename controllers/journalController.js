const Journal = require('../models/Journal');

/**
 * @desc    Get all journal entries for the logged-in user
 * @route   GET /api/journal
 * @access  Private
 */
exports.getAllJournalEntries = async (req, res) => {
    try {
        // Finds all journal entries where the 'user' field matches the logged-in user's ID.
        const entries = await Journal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        console.error(`Get All Journal Entries Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Add a new journal entry
 * @route   POST /api/journal
 * @access  Private
 */
exports.addJournalEntry = async (req, res) => {
    try {
        const { entry, mood } = req.body;
        if (!entry || !mood) {
            return res.status(400).json({ message: 'Entry and mood are required.' });
        }

        const newEntry = await Journal.create({
            user: req.user.id, // ID comes from the auth token
            entry,
            mood
        });
        res.status(201).json(newEntry);
    } catch (error) {
        console.error(`Add Journal Entry Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get a single journal entry by its ID
 * @route   GET /api/journal/:id
 * @access  Private
 */
exports.getJournalEntryById = async (req, res) => {
    try {
        const entry = await Journal.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        // --- SECURITY CHECK ---
        // Ensure the user requesting the entry is the one who created it.
        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(entry);
    } catch (error) {
        console.error(`Get Journal Entry By ID Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update a journal entry
 * @route   PUT /api/journal/:id
 * @access  Private
 */
exports.updateJournalEntry = async (req, res) => {
    try {
        let entry = await Journal.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        // --- SECURITY CHECK ---
        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { entry: newContent, mood } = req.body;
        entry = await Journal.findByIdAndUpdate(req.params.id, { entry: newContent, mood }, { new: true });
        res.json(entry);
    } catch (error) {
        console.error(`Update Journal Entry Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a journal entry
 * @route   DELETE /api/journal/:id
 * @access  Private
 */
exports.deleteJournalEntry = async (req, res) => {
    try {
        const entry = await Journal.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Journal entry not found' });
        }

        // --- SECURITY CHECK ---
        if (entry.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await entry.deleteOne();
        res.json({ message: 'Journal entry removed' });
    } catch (error) {
        console.error(`Delete Journal Entry Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

