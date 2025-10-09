const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

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

exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const eventRef = db.collection('events').doc(id);
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const event = doc.data();
        if (event.owner_id !== userId) {
            return res.status(403).json({ error: 'Forbidden: You do not own this resource.' });
        }

        next();
    } catch (error) {
        console.error('Error in isOwner middleware:', error);
        res.status(500).json({ error: 'Server error' });
    }
};