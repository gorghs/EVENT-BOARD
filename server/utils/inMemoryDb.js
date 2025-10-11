const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Seed a user
const salt = bcrypt.genSaltSync(10);
const password_hash = bcrypt.hashSync('password', salt);

const users = [
    { id: '1', email: 'alice@example.com', password_hash },
];

const events = [
    {
        id: 'test-event-123',
        title: 'Default Test Event',
        description: 'This is a default event for testing purposes.',
        location: 'Test Location',
        date: new Date().toISOString(),
        status: 'draft',
        owner_id: '1', // Assuming '1' is the ID for alice@example.com
        created_at: new Date(),
        updated_at: new Date(),
    }
];

const webhook_deliveries = new Set();

// --- User Functions ---
exports.findUserByEmail = (email) => users.find(u => u.email === email);
exports.findUserById = (id) => users.find(u => u.id === id);

// --- Event Functions ---
exports.getEventsByOwner = (owner_id) => events.filter(e => e.owner_id === owner_id).sort((a, b) => b.created_at - a.created_at);
exports.getEventById = (id) => events.find(e => e.id === id);

exports.createEvent = (eventData) => {
    const newEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    events.push(newEvent);
    return newEvent;
};

exports.updateEvent = (id, owner_id, updateData) => {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return null;

    if (events[eventIndex].owner_id !== owner_id) {
        return null; // Not authorized
    }

    events[eventIndex] = { ...events[eventIndex], ...updateData, updated_at: new Date() };
    return events[eventIndex];
};

exports.deleteEvent = (id, owner_id) => {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return false;

    if (events[eventIndex].owner_id !== owner_id) {
        return false; // Not authorized
    }

    events.splice(eventIndex, 1);
    return true;
};

// --- Webhook Functions ---
