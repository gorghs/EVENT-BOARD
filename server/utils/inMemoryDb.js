const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Seed a user
const salt = bcrypt.genSaltSync(10);
const password_hash = bcrypt.hashSync('password', salt);

const users = [
    { id: '1', email: 'alice@example.com', password_hash },
];

const events = [];

const webhook_deliveries = new Set();

// --- User Functions ---
exports.findUserByEmail = (email) => users.find(u => u.email === email);
exports.findUserById = (id) => users.find(u => u.id === id);

// --- Event Functions ---
exports.getEventsByOwner = (owner_id) => events.filter(e => e.owner_id === owner_id).sort((a, b) => b.created_at - a.created_at);
exports.getEventById = (id) => events.find(e => e.id === id);

exports.createEvent = (eventData) => {
    console.log('inMemoryDb: Events before create:', events.length); // Added log
    const newEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    events.push(newEvent);
    console.log('inMemoryDb: Events after create:', events.length, newEvent.id); // Added log
    return newEvent;
};

exports.updateEvent = (id, updateData) => {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return null;

    events[eventIndex] = { ...events[eventIndex], ...updateData, updated_at: new Date() };
    return events[eventIndex];
};

exports.deleteEvent = (id) => {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return false;

    events.splice(eventIndex, 1);
    return true;
};

// --- Webhook Functions ---
exports.hasDelivery = (delivery_id) => webhook_deliveries.has(delivery_id);
exports.addDelivery = (delivery_id) => webhook_deliveries.add(delivery_id);
