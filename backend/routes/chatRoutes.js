const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { auth } = require('../middleware/authMiddleware');

router.get('/user-groups/:userId', auth, chatController.getUserChatGroups);
router.get('/messages/:groupId', auth, chatController.getChatMessages);
router.post('/send', auth, chatController.sendMessage);

module.exports = router;
