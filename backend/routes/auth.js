const express = require('express');
const passport = require('passport');
const { register, login, googleLogin, setRole } = require('../controllers/authController');
const { auth, isAdmin, isMainAdmin } = require('../middleware/authMiddleware'); // Import middleware
const { getAllUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register); 
router.post('/login', login); 
router.post('/google', googleLogin); 
router.get('/users', auth, isAdmin, getAllUsers);


router.post('/set-role', auth, isMainAdmin, setRole); 

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/home');  
    }
);

module.exports = router;
