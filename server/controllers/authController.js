const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const inMemoryDb = require('../utils/inMemoryDb');

// Seed user function (now just a confirmation)
const seedUser = async () => {
    const user = inMemoryDb.findUserByEmail('alice@example.com');
    if (user) {
        console.log('✅ Seed user alice@example.com loaded from in-memory store.');
    } else {
        console.error('Could not find seed user in in-memory store!');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = inMemoryDb.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    login,
    seedUser,
};