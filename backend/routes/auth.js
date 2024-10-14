const express = require('express');
const passport = require('passport');
const { register, login, googleAuthCallback, googleLogin, setRole } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/set-role', setRole);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/home');  
    }
  );

module.exports = router;


