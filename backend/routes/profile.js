const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const router = express.Router();

router.get('/:userId', getUserProfile);

router.put('/:userId', updateUserProfile);

module.exports = router;