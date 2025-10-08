-- User Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Event Table (First-Party Data)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    description TEXT,
    status VARCHAR(10) NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id, owner_id) -- Ensures an event ID is unique per owner context (good for future sharding)
);

-- Webhook Idempotency Log
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    delivery_id UUID PRIMARY KEY,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    payload JSONB NOT NULL
);

-- Seed User (alice@example.com / password) - will be done in the auth controller for simplicity