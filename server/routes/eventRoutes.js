const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const publicEventAdapter = require('../controllers/publicEventAdapter');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/', 
    authMiddleware.protect, 
    validationMiddleware.validateEvent, 
    eventController.createEvent
);

router.get('/', 
    authMiddleware.protect, 
    eventController.getEvents
);

router.get('/public-events', publicEventAdapter.getPublicEvents);

router.get('/:id', 
    authMiddleware.protect, 
    eventController.getEventById
);

router.patch('/:id', 
    authMiddleware.protect, 
    authMiddleware.isOwner, 
    eventController.updateEvent
);

router.delete('/:id', 
    authMiddleware.protect, 
    authMiddleware.isOwner, 
    eventController.deleteEvent
);

module.exports = router;