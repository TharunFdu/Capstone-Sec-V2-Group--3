const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const {auth, isAdmin} = require('../middleware/authMiddleware'); 

router.post('/', auth,isAdmin, eventController.createEvent);  
router.get('/', auth, eventController.getEvents);
router.get('/:id', auth, eventController.getEventById);
router.put('/:id', auth,isAdmin, eventController.updateEvent);
router.delete('/:id', auth,isAdmin, eventController.deleteEvent);

module.exports = router;
