const Venue = require('../models/Venue');

exports.createVenue = async (req, res) => {
  console.log('User creating venue:', req.user);  

  try {
    const { name, location, capacity } = req.body;
    const createdBy = req.user.userId;  

    if (!createdBy) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    const venue = await Venue.create({
      name,
      location,
      capacity,
      createdBy,  
    });

    res.status(201).json(venue);
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ error: 'Failed to create venue.' });
  }
};

exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    res.status(200).json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ error: 'Failed to retrieve venues.' });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found.' });
    }
    res.status(200).json(venue);
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ error: 'Failed to retrieve venue.' });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found.' });
    }

    if (venue.createdBy !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You can only update venues you created.' });
    }

    await venue.update(req.body);  
    res.status(200).json(venue);
  } catch (error) {
    console.error('Error updating venue:', error);
    res.status(500).json({ error: 'Failed to update venue.' });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByPk(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found.' });
    }

    if (venue.createdBy !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You can only delete venues you created.' });
    }

    await venue.destroy();  
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting venue:', error);
    res.status(500).json({ error: 'Failed to delete venue.' });
  }
};
