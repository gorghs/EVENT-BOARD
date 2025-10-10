const inMemoryDb = require('../utils/inMemoryDb');

const createEvent = async (req, res) => {
    const { title, date, location, description, status } = req.body;
    const owner_id = req.user.id;

    try {
        const newEvent = inMemoryDb.createEvent({ title, date, location, description, status, owner_id });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEvents = async (req, res) => {
    const owner_id = req.user.id;
    const { status, search } = req.query;

    try {
        let events = inMemoryDb.getEventsByOwner(owner_id);

        if (status) {
            events = events.filter(e => e.status === status);
        }

        if (search) {
            events = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
        }

        res.json({ events, total: events.length });
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEventById = async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.id;

    try {
        const event = inMemoryDb.getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        if (event.owner_id !== owner_id) {
            return res.status(403).json({ error: 'User not authorized to view this event' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error loading event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, location, description, status } = req.body;

    try {
        const updatedEvent = inMemoryDb.updateEvent(id, { title, date, location, description, status });
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const success = inMemoryDb.deleteEvent(id);
        if (!success) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting event:', error);
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