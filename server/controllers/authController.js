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
    console.log('Login attempt for email:', email);

    if (!email || !password) {
        console.log('Login error: Missing email or password');
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const user = inMemoryDb.findUserByEmail(email);
        console.log('User found in inMemoryDb:', user ? user.email : 'None');

        if (!user) {
            console.log('Login error: Invalid credentials (user not found)');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Login error: Invalid credentials (password mismatch)');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            id: user.id,
        };

        const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
        console.log('Using JWT_SECRET:', jwtSecret === 'dev-secret' ? 'dev-secret (fallback)' : 'from .env');

        const token = jwt.sign(payload, jwtSecret, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        });
        console.log('Token generated successfully.');

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const seed = async (req, res) => {
    try {
        await seedUser();
        res.status(200).json({ message: 'User seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    login,
    seedUser,
    seed,
};