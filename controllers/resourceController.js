const Resource = require('../models/Resource');

/**
 * @desc    Get all available resources
 * @route   GET /api/resources
 * @access  Private
 */
exports.getAllResources = async (req, res) => {
    try {
        // Find all resources and sort them by creation date
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        console.error(`Get All Resources Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Add a new resource
 * @route   POST /api/resources
 * @access  Private (Admin/Counselor only)
 */
exports.addResource = async (req, res) => {
    try {
        const { title, type, content, language } = req.body;
        if (!title || !type || !content) {
            return res.status(400).json({ message: 'Title, type, and content are required.' });
        }

        const newResource = await Resource.create({
            title,
            type,
            content, // For video/audio, this could be a URL. For guides, it could be text/markdown.
            language: language || 'English' // Default to English if not provided
        });

        res.status(201).json(newResource);
    } catch (error) {
        console.error(`Add Resource Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update an existing resource
 * @route   PUT /api/resources/:id
 * @access  Private (Admin/Counselor only)
 */
exports.updateResource = async (req, res) => {
    try {
        let resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // The fields to be updated are taken from the request body
        resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(resource);
    } catch (error) {
        console.error(`Update Resource Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a resource
 * @route   DELETE /api/resources/:id
 * @access  Private (Admin/Counselor only)
 */
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        await resource.deleteOne();
        res.json({ message: 'Resource removed successfully' });
    } catch (error) {
        console.error(`Delete Resource Error: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
};

