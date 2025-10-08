const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // Attach user ID to request
        next();
    } catch (error) {
        console.error('Token validation failed:', error.message);
        res.status(401).json({ error: 'Not authorized, token invalid' });
    }
};

exports.isOwner = (req, res, next) => {
    // This will be used in eventController, assuming req.event has been loaded.
    if (req.event && req.event.owner_id === req.user.id) {
        return next();
    }
    res.status(403).json({ error: 'Forbidden: You do not own this resource.' });
};