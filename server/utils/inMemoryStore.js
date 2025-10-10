const { randomUUID } = require('crypto');

const eventsById = new Map();

function addEvent(event) {
	const id = randomUUID();
	const now = new Date();
	const stored = { ...event, created_at: now, updated_at: now };
	eventsById.set(id, stored);
	return { id, ...stored };
}

function listEvents(ownerId) {
	const all = [];
	for (const [id, data] of eventsById.entries()) {
		if (data.owner_id === ownerId) all.push({ id, ...data });
	}
	// sort by date desc if present
	all.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
	return all;
}

function getEvent(id) {
	const data = eventsById.get(id);
	return data ? { id, ...data } : null;
}

function updateEvent(id, owner_id, updates) {
    const existing = eventsById.get(id);
    if (!existing) {
        return null;
    }
    if (existing.owner_id !== owner_id) {
        return null;
    }
    const updated = { ...existing, ...updates, updated_at: new Date() };
    eventsById.set(id, updated);
    return { id, ...updated };
}

function deleteEvent(id, owner_id) {
    const existing = eventsById.get(id);
    if (!existing || existing.owner_id !== owner_id) return false;
	return eventsById.delete(id);
}

module.exports = {
	addEvent,
	listEvents,
	getEvent,
	updateEvent,
	deleteEvent,
};


