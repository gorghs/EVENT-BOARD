const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/external-events', 
    express.raw({type: 'application/json'}), 
    webhookController.handleExternalEvent
);

module.exports = router;