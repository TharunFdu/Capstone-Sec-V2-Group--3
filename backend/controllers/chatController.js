const ChatGroup = require('../models/ChatGroup');
const ChatGroupMember = require('../models/ChatGroupMember');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

exports.getUserChatGroups = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const chatGroups = await ChatGroupMember.findAll({
        where: { userId },
        include: [
          {
            model: ChatGroup,
            attributes: ['groupName', 'eventId'], 
          },
        ],
      });
  
      if (!chatGroups || chatGroups.length === 0) {
        return res.status(404).json({ message: 'No chat groups found for this user.' });
      }
  
      res.status(200).json(chatGroups);
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      res.status(500).json({ message: 'Error fetching chat groups' });
    }
  };

exports.getChatMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await ChatMessage.findAll({
      where: { groupId },
      include: [{ model: User, attributes: ['name'] }],
    });

 if (!messages || messages.length === 0) {
    return res.status(200).json([]);  
  }

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Error fetching chat messages' });
  }
};

exports.sendMessage = async (req, res) => {
    const { groupId, userId, message } = req.body;  
  
    try {
      const chatGroup = await ChatGroup.findByPk(groupId);
      if (!chatGroup) {
        return res.status(404).json({ message: 'Chat group not found.' });
      }
  
      const newMessage = await ChatMessage.create({
        groupId,
        userId,
        message,
      });
  
      res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  };
  