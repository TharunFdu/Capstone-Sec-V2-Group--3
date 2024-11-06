const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Venue = require('../models/Venue');
const { Op } = require('sequelize');

exports.getRecommendations = async (req, res) => {
  const userId = req.query.userId; 

  try {
    const user = await User.findByPk(userId, { attributes: ['location'] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userLocation = user.location;

    const bookings = await Booking.findAll({ where: { userId } });
    const bookedEventIds = bookings.map(booking => booking.eventId);

    const bookedEvents = await Event.findAll({
      where: { id: { [Op.in]: bookedEventIds } },
      attributes: ['title', 'createdBy'],
    });
    const bookedTitles = bookedEvents.map(event => event.title);
    const bookedCreators = bookedEvents.map(event => event.createdBy);

    const recommendedEvents = await Event.findAll({
      where: {
        id: { [Op.notIn]: bookedEventIds }, 
        [Op.or]: [
          { '$venue.location$': userLocation }, 
          { 
            [Op.or]: [
              { title: { [Op.in]: bookedTitles } }, 
              { createdBy: { [Op.in]: bookedCreators } } 
            ]
          }
        ]
      },
      include: [{ model: Venue, as: 'venue', attributes: ['location'] }],
      limit: 10
    });

    res.status(200).json(recommendedEvents);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
