const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Event = require('./Event');

const ChatGroup = sequelize.define('ChatGroup', {
  eventId: {
    type: DataTypes.INTEGER,
    references: {
      model: Event,
      key: 'id',
    },
    allowNull: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ChatGroup;
