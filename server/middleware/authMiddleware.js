const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from the decoded token payload
            // .select('-password') ensures password hash is not returned
            req.user = await User.findById(decoded.id).select('-password');

            // If user is found, proceed to the next middleware/route handler
            next();
        } catch (error) {
            // Log specific JWT errors for debugging
            console.error('JWT verification error:', error.message);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    // If no token is provided in the header
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

module.exports = { protect };