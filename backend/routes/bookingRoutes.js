const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/book', bookingController.bookEvent);

router.post('/cancel', bookingController.cancelBooking);

router.get('/user/:userId', bookingController.getUserBookings);

module.exports = router;
