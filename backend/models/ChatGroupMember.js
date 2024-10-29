const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ChatGroup = require('./ChatGroup');
const User = require('./User');

const ChatGroupMember = sequelize.define('ChatGroupMember', {
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
}, {
    timestamps: true,
  });

ChatGroupMember.belongsTo(ChatGroup, { foreignKey: 'groupId' });
// ChatGroup.hasMany(ChatGroupMember, { foreignKey: 'groupId' });

ChatGroupMember.belongsTo(User, { foreignKey: 'userId' });

module.exports = ChatGroupMember;
