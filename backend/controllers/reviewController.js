const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { Op, sequelize } = require('sequelize'); 

exports.addReview = async (req, res) => {
  const { eventId } = req.params;
  const { userId, rating, review } = req.body;

  try {
    const booking = await Booking.findOne({
      where: { eventId, userId, status: 'booked' },
    });

    if (!booking) {
      return res.status(403).json({ message: 'You can only review events you have booked.' });
    }

    const newReview = await Review.create({ eventId, userId, rating, review });
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
};

exports.getEventReviews = async (req, res) => {
  const { eventId } = req.params;

  try {
    const reviews = await Review.findAll({ where: { eventId } });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

exports.getAverageRating = async (req, res) => {
    const { eventId } = req.params;
  
    try {
      const reviews = await Review.findAll({
        where: { eventId },
        attributes: ['rating'], 
        raw: true,             
      });
  
      if (reviews.length === 0) {
        return res.status(200).json({ averageRating: 'No ratings yet' });
      }
  
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = (totalRating / reviews.length).toFixed(2);
  
      res.status(200).json({ averageRating });
    } catch (error) {
      console.error('Error calculating average rating:', error);
      res.status(500).json({ message: 'Failed to calculate average rating.' });
    }
  };
  