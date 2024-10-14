const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const keys = require('./keys');

passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/api/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ where: { googleId: profile.id } });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      role: 'user',
    });

    done(null, newUser);
  } catch (err) {
    done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
});
