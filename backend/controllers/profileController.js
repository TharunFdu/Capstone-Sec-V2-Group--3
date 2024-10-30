const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log("User ID (Backend):", userId);

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { name, oldPassword, newPassword } = req.body;

  try {
    console.log("Updating User ID (Backend):", userId);

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!user.password) {
        user.password = await bcrypt.hash(newPassword, 10);
      } else if (oldPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Old password is incorrect' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      } else {
        return res.status(400).json({ message: 'Please provide the old password to update' });
      }
    }

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
