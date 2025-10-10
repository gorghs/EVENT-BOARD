// const express = require('express');
// const helmet = require('helmet');
// const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const authRoutes = require('./routes/authRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const webhookRoutes = require('./routes/webhookRoutes');
// const { seedUser } = require('./controllers/authController');


// const app = express();
// const PORT = process.env.PORT || 5000;

// // Security Middleware
// app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' })); // Use specific origin in production

// // Rate Limiting (Protects against brute force and DDoS)
// const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     standardHeaders: true,
//     legacyHeaders: false,
// });
// app.use('/api/', apiLimiter);

// // Global Body Parser (NOT for webhooks)
// app.use(express.json());

// // Routes
// app.get('/healthz', (req, res) => res.status(200).send('OK'));
// app.use('/auth', authRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/webhooks', webhookRoutes);

// app.listen(PORT, async () => {
//     console.log(`🚀 Server running on port ${PORT}`);
    
//     // Seed the test user
//     await seedUser();
// });  onst express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // body-parser is a good practice to include explicitly

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const { seedUser } = require('./controllers/authController');


const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
// This is the simplest setup to accept all requests
app.use(cors());

// Use body-parser for all incoming requests (except webhooks, which need raw body)
// Note: If your webhook needs a raw body, this global parser might interfere.
// For this project's structure, it should be fine.
app.use(express.json());


// Routes
app.get('/healthz', (req, res) => res.status(200).send('OK'));
app.use('/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/webhooks', webhookRoutes);

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Seed the test user
    await seedUser();
});


