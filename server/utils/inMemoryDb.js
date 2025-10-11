const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'db.json');

const readDb = () => {
    try {
        if (fs.existsSync(dbPath)) {
            const data = fs.readFileSync(dbPath, 'utf8');
            return JSON.parse(data);
        }
        return { users: [], events: [] };
    } catch (error) {
        console.error('Error reading database file:', error);
        return { users: [], events: [] };
    }
};

const writeDb = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to database file:', error);
    }
};

// Seed a user if the database is empty
const db = readDb();
if (db.users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync('password', salt);
    db.users.push({ id: '1', email: 'alice@example.com', password_hash });
    writeDb(db);
}

// --- User Functions ---
exports.findUserByEmail = (email) => {
    const db = readDb();
    return db.users.find(u => u.email === email);
};

exports.findUserById = (id) => {
    const db = readDb();
    return db.users.find(u => u.id === id);
};

// --- Event Functions ---
exports.getEventsByOwner = (owner_id) => {
    const db = readDb();
    return db.events.filter(e => e.owner_id === owner_id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

exports.getEventById = (id) => {
    const db = readDb();
    return db.events.find(e => e.id === id);
};

exports.createEvent = (eventData) => {
    const db = readDb();
    const newEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        created_at: new Date(),
        updated_at: new Date(),
    };
    db.events.push(newEvent);
    writeDb(db);
    return newEvent;
};

exports.updateEvent = (id, owner_id, updateData) => {
    const db = readDb();
    const eventIndex = db.events.findIndex(e => e.id === id);
    if (eventIndex === -1) return null;

    if (db.events[eventIndex].owner_id !== owner_id) {
        return null; // Not authorized
    }

    db.events[eventIndex] = { ...db.events[eventIndex], ...updateData, updated_at: new Date() };
    writeDb(db);
    return db.events[eventIndex];
};

exports.deleteEvent = (id, owner_id) => {
    const db = readDb();
    const eventIndex = db.events.findIndex(e => e.id === id);
    if (eventIndex === -1) return false;

    if (db.events[eventIndex].owner_id !== owner_id) {
        return false; // Not authorized
    }

    db.events.splice(eventIndex, 1);
    writeDb(db);
    return true;
};

// --- Webhook Functions ---
