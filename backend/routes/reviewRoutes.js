const express = require('express');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.post('/events/:eventId/reviews', reviewController.addReview); 
router.get('/events/:eventId/reviews', reviewController.getEventReviews); 
router.get('/events/:eventId/average-rating', reviewController.getAverageRating); 


module.exports = router;
