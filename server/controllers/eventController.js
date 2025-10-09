const { db } = require('../config/db');

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

        if (search) {
            query = query.where('title', '>=', search).where('title', '<=', search + '\uf8ff');
        }

        if (lastVisible) {
            const lastVisibleDoc = await db.collection('events').doc(lastVisible).get();
            query = query.startAfter(lastVisibleDoc);
        }

        query = query.limit(limit);

        const snapshot = await query.get();
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const newLastVisible = snapshot.docs[snapshot.docs.length - 1];

        res.json({ events, lastVisible: newLastVisible ? newLastVisible.id : null });
    } catch (error) {
        console.error('Error getting events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const eventRef = db.collection('events').doc(id);
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error loading event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, location, description, status } = req.body;

    try {
        const eventRef = db.collection('events').doc(id);
        const doc = await eventRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        await eventRef.update({
            title,
            date,
            location,
            description,
            status,
            updated_at: new Date(),
        });

        const updatedDoc = await eventRef.get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;

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