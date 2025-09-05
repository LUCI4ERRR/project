const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @desc    Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check if the token is sent in the headers and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGciOiJIUz...")
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by the ID from the token's payload
            // '-password' ensures the password hash is not attached to the request object
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // User is authenticated, proceed to the next middleware/controller
        } catch (error) {
            console.error(`Token Verification Error: ${error.message}`);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * @desc    Middleware to authorize users based on roles
 * @param   {...string} roles - A list of roles that are allowed to access the route
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // The 'protect' middleware must run first to attach 'req.user'
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
        }
        next(); // User has the required role, proceed
    };
};

