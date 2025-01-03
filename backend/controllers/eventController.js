const Event = require('../models/Event');
const ChatGroup = require('../models/ChatGroup');
const ChatGroupMember = require('../models/ChatGroupMember');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.upload = upload.single('image');

exports.createEvent = async (req, res) => {
  try {
    const { title, venueId, date, time, capacity } = req.body;
    const createdBy = req.user.userId || req.user.id;

    if (!createdBy) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const event = await Event.create({
      title,
      venueId,
      date,
      time,
      capacity,
      createdBy,
      image: imageUrl, 
    });

    const chatGroup = await ChatGroup.create({
      eventId: event.id,
      adminId: createdBy,
      groupName: `${title} Chat Group`,
    });

    await ChatGroupMember.create({
      groupId: chatGroup.id,
      userId: createdBy,
    });

    res.status(201).json({ message: 'Event and chat group created successfully, admin added to the group.', event, chatGroup });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event.' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query; 
    let whereClause = {};
    if(search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }
    if (startDate && endDate) {
      whereClause.date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
      const events = await Event.findAll({ where: whereClause, });
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to retrieve events.' });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to retrieve event.' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.createdBy !== req.user.userId && event.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only update events you created.' });
    }

    await event.update(req.body);
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    if (event.createdBy !== req.user.userId && event.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You can only delete events you created.' });
    }

    await event.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event.' });
  }
};
