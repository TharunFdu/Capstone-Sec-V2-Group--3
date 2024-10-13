const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const {auth, isAdmin} = require('../middleware/authMiddleware');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  
  }
});

const upload = multer({ storage: storage });

router.post('/', auth, isAdmin, upload.single('image'), eventController.createEvent);  
router.get('/', auth, eventController.getEvents);
router.get('/:id', auth, eventController.getEventById);
router.put('/:id', auth, isAdmin, eventController.updateEvent);
router.delete('/:id', auth, isAdmin, eventController.deleteEvent);

module.exports = router;
