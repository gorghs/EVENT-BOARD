const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
    connectionString: process.env.PG_URI,
});

// Utility function to run initial setup and seed user
pool.query('SELECT 1 + 1 AS result')
    .then(() => console.log('✅ PostgreSQL connected and healthy.'))
    .catch(err => {
        console.error('❌ DB CONNECTION ERROR:', err);
        // process.exit(1); // Exit if DB connection fails
    });

module.exports = {
    query: (text, params) => pool.query(text, params),
};