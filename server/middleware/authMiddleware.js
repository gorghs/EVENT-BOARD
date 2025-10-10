const jwt = require('jsonwebtoken');
const inMemoryDb = require('../utils/inMemoryDb');

exports.protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        console.error('Token validation failed:', error.message);
        res.status(401).json({ error: 'Not authorized, token invalid' });
    }
};

exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`[isOwner Middleware] Checking ownership for event ID: ${id} by user ID: ${userId}`);

    try {
        const event = inMemoryDb.getEventById(id);
        if (!event) {
            console.log(`[isOwner Middleware] Event with ID: ${id} not found.`);
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (event.owner_id !== userId) {
            console.log(`[isOwner Middleware] User ${userId} is not the owner of event ${id}. Owner: ${event.owner_id}`);
            return res.status(403).json({ error: 'Forbidden: You do not own this resource.' });
        }

        console.log(`[isOwner Middleware] User ${userId} is the owner of event ${id}. Proceeding.`);
        next();
    } catch (error) {
        console.error('[isOwner Middleware] Error in isOwner middleware:', error);
        res.status(500).json({ error: 'Server error' });
    }
};