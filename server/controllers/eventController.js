const db = require('../config/db');

// Middleware to load event and attach to request
const loadEvent = async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        req.event = result.rows[0];
        next();
    } catch (error) {
        console.error('Error loading event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createEvent = async (req, res) => {
    const { title, date, location, description, status } = req.body;
    const owner_id = req.user.id;

    try {
        const result = await db.query(
            'INSERT INTO events (title, date, location, description, status, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, date, location, description, status, owner_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEvents = async (req, res) => {
    const owner_id = req.user.id;
    const { status, search, page = 1, limit = 10 } = req.query;

    let query = 'SELECT * FROM events WHERE owner_id = $1';
    const params = [owner_id];
    let paramIndex = 2;

    if (status) {
        query += ` AND status = $${paramIndex++}`;
        params.push(status);
    }

    if (search) {
        query += ` AND title ILIKE $${paramIndex++}`;
        params.push(`%${search}%`);
    }

    const offset = (page - 1) * limit;
    query += ` ORDER BY date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEventById = (req, res) => {
    // The loadEvent middleware has already fetched the event and attached it to req.event
    res.json(req.event);
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, location, description, status } = req.body;

    try {
        const result = await db.query(
            'UPDATE events SET title = $1, date = $2, location = $3, description = $4, status = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
            [title, date, location, description, status, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM events WHERE id = $1', [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    loadEvent,
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};