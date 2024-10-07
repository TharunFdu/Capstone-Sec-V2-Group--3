const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    console.log('User creating event:', req.user);  

    const { title, venueId, date, time, capacity } = req.body;
    const createdBy = req.user.userId || req.user.id;  

    if (!createdBy) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const event = await Event.create({
      title,
      venueId,
      date,
      time,
      capacity,
      createdBy,  
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event.' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    let events;

    if (req.user && req.user.role === 'admin') {
      const adminId = req.user.userId;
      events = await Event.findAll({ where: { createdBy: adminId } });
    } else {
      events = await Event.findAll();  
    }
    
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
