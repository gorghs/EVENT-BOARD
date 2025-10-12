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

  async updateEvent(req, res) {
    console.log('updateEvent: req.user:', req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User information missing.' });
    }
    const { id } = req.params;
    const { title, description, date, location } = req.body;
    const owner_id = req.user.id;

    console.log(`[eventController.updateEvent] Received request to update event ${id}`);
    console.log('[eventController.updateEvent] Request body:', req.body);

    try {
        const updatedEvent = inMemoryDb.updateEvent(id, owner_id, { title, date, location, description, status });
        
        console.log(`[eventController.updateEvent] Result of updateEvent call:`, updatedEvent);
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found or user not authorized.' });
        }
        res.json(updatedEvent);
    } catch (error) {
        console.error('[eventController.updateEvent] Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const owner_id = req.user.id;

    try {
        const success = inMemoryDb.deleteEvent(id, owner_id);
        if (!success) {
            return res.status(404).json({ error: 'Event not found or user not authorized.' });
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