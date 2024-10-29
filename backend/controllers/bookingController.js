const Booking = require('../models/Booking');
const Event = require('../models/Event');
const ChatGroupMember = require('../models/ChatGroupMember');
const ChatGroup = require('../models/ChatGroup');


exports.bookEvent = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const existingBooking = await Booking.findOne({ where: { userId, eventId } });
    if (existingBooking) {
      return res.status(400).json({ error: 'User already booked this event' });
    }

    const booking = await Booking.create({ userId, eventId });

    const chatGroup = await ChatGroup.findOne({ where: { eventId } });
    if (!chatGroup) {
      return res.status(404).json({ error: 'Chat group for this event not found' });
    }

    await ChatGroupMember.create({
      groupId: chatGroup.id, 
      userId,
    });

    res.status(201).json({ message: 'Event booked and user added to chat group', booking });
  } catch (error) {
    console.error('Error booking event and adding user to chat group:', error);
    res.status(500).json({ error: 'Failed to book event and add user to chat group.' });
  }
};

exports.cancelBooking = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    const booking = await Booking.findOne({ where: { userId, eventId } });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update({ status: 'canceled' });
    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  const { userId } = req.params;

  console.log("User ID (Backend):", userId);

  try {
    const bookings = await Booking.findAll({ where: { userId } });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

