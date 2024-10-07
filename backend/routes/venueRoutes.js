const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { auth, isAdmin } = require('../middleware/authMiddleware'); 

router.post('/', auth, isAdmin, venueController.createVenue);  
router.get('/', auth, venueController.getVenues); 
router.get('/:id', auth, venueController.getVenueById);  
router.put('/:id', auth, isAdmin, venueController.updateVenue);  
router.delete('/:id', auth, isAdmin, venueController.deleteVenue); 

module.exports = router;
