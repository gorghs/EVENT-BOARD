const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const axios = require('axios');
const authRoutes = require('../routes/authRoutes');
const eventRoutes = require('../routes/eventRoutes');
const webhookRoutes = require('../routes/webhookRoutes');

// Mock dependencies
jest.mock('../config/db', () => ({ query: jest.fn() }));
jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

let server;
beforeAll(() => {
    server = app.listen(5001);
    process.env.JWT_SECRET = 'test-secret';
    process.env.WEBHOOK_SECRET = 'test-webhook-secret';
    process.env.JWT_EXPIRES_IN = '1d';
});

afterAll((done) => {
    server.close(done);
});

describe('EventBoard API', () => {
    let aliceToken;
    let bobToken;
    let eventId = 123;

    beforeAll(async () => {
        const alicePassword = 'password';
        const bobPassword = 'password123';
        const aliceHash = await bcrypt.hash(alicePassword, 10);
        const bobHash = await bcrypt.hash(bobPassword, 10);

        db.query.mockImplementation((sql, values) => {
            if (sql.startsWith('SELECT * FROM users WHERE email')) {
                if (values[0] === 'alice@example.com') return Promise.resolve({ rows: [{ id: 1, email: 'alice@example.com', password_hash: aliceHash }] });
                if (values[0] === 'bob@example.com') return Promise.resolve({ rows: [{ id: 2, email: 'bob@example.com', password_hash: bobHash }] });
                return Promise.resolve({ rows: [] });
            }
            if (sql.startsWith('INSERT INTO events')) return Promise.resolve({ rows: [{ id: eventId, owner_id: 1, ...values }] });
            if (sql.startsWith('SELECT * FROM events WHERE id')) return Promise.resolve({ rows: [{ id: eventId, owner_id: values[0] === 1 ? 1 : 2 }] });
            if (sql.startsWith('SELECT * FROM events WHERE owner_id')) return Promise.resolve({ rows: [{ id: eventId, owner_id: 1, title: 'Test Event' }] });
            if (sql.startsWith('DELETE FROM events')) return Promise.resolve({ rowCount: 1 });
            if (sql.startsWith('UPDATE events')) return Promise.resolve({ rows: [{ id: eventId, owner_id: 1, status: 'published' }] });
            if (sql.startsWith('SELECT delivery_id')) return Promise.resolve({ rows: [] });
            if (sql.startsWith('INSERT INTO webhook_deliveries')) return Promise.resolve({ rows: [] });
            return Promise.resolve({ rows: [] });
        });

        const aliceRes = await request(app).post('/auth/login').send({ email: 'alice@example.com', password: alicePassword });
        aliceToken = aliceRes.body.token;
        const bobRes = await request(app).post('/auth/login').send({ email: 'bob@example.com', password: bobPassword });
        bobToken = bobRes.body.token;
    });

    test('should create and fetch an event for an authenticated user', async () => {
        const newEvent = { title: 'My Test Event', date: '2025-12-25T20:00:00.000Z', location: 'Test Location', description: 'This is a test event.', status: 'draft' };
        const createRes = await request(app).post('/api/events').set('Authorization', `Bearer ${aliceToken}`).send(newEvent);
        expect(createRes.statusCode).toEqual(201);
        expect(createRes.body).toHaveProperty('id');
        const createdEventId = createRes.body.id;
        const fetchRes = await request(app).get(`/api/events/${createdEventId}`).set('Authorization', `Bearer ${aliceToken}`);
        expect(fetchRes.statusCode).toEqual(200);
    });

    test('should list all events for the authenticated user', async () => {
        const res = await request(app).get('/api/events').set('Authorization', `Bearer ${aliceToken}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('should delete an event for the owner', async () => {
        const res = await request(app).delete(`/api/events/${eventId}`).set('Authorization', `Bearer ${aliceToken}`);
        expect(res.statusCode).toEqual(204);
    });

    test('should fetch public events', async () => {
        const mockEvents = [{ id: 1, title: 'Public Event', body: 'Public event body', created_at: new Date().toISOString(), user: { login: 'github' } }];
        axios.get.mockResolvedValue({ data: mockEvents });
        const res = await request(app).get('/api/events/public-events');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].title).toBe('Public Event');
    });

    test('should return 403 when a user tries to update an event they do not own', async () => {
        const updateRes = await request(app).patch(`/api/events/${eventId}`).set('Authorization', `Bearer ${bobToken}`).send({ status: 'published' });
        expect(updateRes.statusCode).toEqual(403);
    });

    test('should return 401 for a webhook with an invalid signature', async () => {
        const body = JSON.stringify({ event_id: eventId, new_status: 'published', delivery_id: 'some-uuid' });
        const res = await request(app).post('/webhooks/external-events').set('Content-Type', 'application/json').set('X-External-Signature', 'sha256=invalidsignature').send(body);
        expect(res.statusCode).toEqual(401);
    });
});