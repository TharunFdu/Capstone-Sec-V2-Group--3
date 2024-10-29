const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ChatGroup = require('./ChatGroup');
const User = require('./User');

const ChatMessage = sequelize.define('ChatMessage', {
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: ChatGroup,
      key: 'id',
    },
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
        model: User,
        key: 'id',
      },
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},
  {
    timestamps: true,
  });

  ChatMessage.belongsTo(ChatGroup, { foreignKey: 'groupId' });
ChatMessage.belongsTo(User, { foreignKey: 'userId' });

module.exports = ChatMessage;
