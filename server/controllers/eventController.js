const { db } = require('../config/db');
const store = require('../utils/inMemoryStore');

const createEvent = async (req, res) => {
    const { title, date, location, description, status } = req.body;
    const owner_id = req.user.id;

    try {
        const newEventRef = await db.collection('events').add({
            title,
            date,
            location,
            description,
            status,
            owner_id,
            created_at: new Date(),
            updated_at: new Date(),
        });
        const newEvent = await newEventRef.get();
        res.status(201).json({ id: newEvent.id, ...newEvent.data() });
    } catch (error) {
        console.error('Error creating event:', error);
        if (process.env.ALLOW_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production') {
            const created = store.addEvent({ title, date, location, description, status, owner_id });
            return res.status(201).json(created);
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const getEvents = async (req, res) => {
    const owner_id = req.user.id;
    const { status, search, page = 1, limit = 10, lastVisible } = req.query;

    try {
        let query = db.collection('events').where('owner_id', '==', owner_id).orderBy('date', 'desc');

        if (status) {
            query = query.where('status', '==', status);
        }

        const snapshot = await query.get();
        let events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (search) {
            events = events.filter(event => event.title.toLowerCase().includes(search.toLowerCase()));
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedEvents = events.slice(startIndex, endIndex);

        res.json({ events: paginatedEvents, total: events.length });

    } catch (error) {
        console.error('Error getting events:', error);
        if (process.env.ALLOW_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production') {
            const events = store.listEvents(owner_id);
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedEvents = events.slice(startIndex, endIndex);
            return res.json({ events: paginatedEvents, total: events.length });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const getEventById = async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.id;

    try {
        const eventRef = db.collection('events').doc(id);
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (doc.data().owner_id !== owner_id) {
            return res.status(403).json({ error: 'User not authorized to view this event' });
        }

        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error loading event:', error);
        if (process.env.ALLOW_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production') {
            const found = store.getEvent(id);
            if (!found) return res.status(404).json({ error: 'Event not found.' });
            if (found.owner_id !== owner_id) return res.status(403).json({ error: 'User not authorized to view this event' });
            return res.json(found);
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.id; // Get owner_id from the request
    const { title, date, location, description, status } = req.body;

    try {
        const eventRef = db.collection('events').doc(id);
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (date) updateData.date = date;
        if (location) updateData.location = location;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        updateData.updated_at = new Date();

        await eventRef.update(updateData);

        const updatedDoc = await eventRef.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        console.error('Error updating event:', error);
        if (process.env.ALLOW_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production') {
            const updated = store.updateEvent(id, owner_id, { title, date, location, description, status });
            if (!updated) return res.status(404).json({ error: 'Event not found.' });
            return res.json(updated);
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.id; // Get owner_id from the request

    try {
        const eventRef = db.collection('events').doc(id);
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        await eventRef.delete();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
        if (process.env.ALLOW_DEV_LOGIN === 'true' && process.env.NODE_ENV !== 'production') {
            const ok = store.deleteEvent(id, owner_id);
            if (!ok) return res.status(404).json({ error: 'Event not found.' });
            return res.status(204).send();
        }
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};