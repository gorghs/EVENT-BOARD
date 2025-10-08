const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const seedUser = async () => {
    const email = 'alice@example.com';
    const password = 'password';

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            await db.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, password_hash]);
            console.log('👤 Seed user alice@example.com created.');
        }
    } catch (error) {
        console.error('Error seeding user:', error);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

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

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    seedUser,
    login,
};
