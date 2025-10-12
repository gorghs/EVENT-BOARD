const jwt = require('jsonwebtoken');
const inMemoryDb = require('../utils/inMemoryDb');

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.body.token;
  console.log('Auth Middleware: Token received:', token ? '[TOKEN_RECEIVED]' : '[NO_TOKEN]');

  if (!token) {
    console.error('Auth Middleware: No token, authorization denied');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret'); // Added fallback
    req.user = decoded;
    console.log('Auth Middleware: Decoded user:', req.user);
    next();
  } catch (err) {
    console.error('Auth Middleware: Token verification error:', err.message);
    res.status(401).json({ message: `Token is not valid: ${err.message}` });
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