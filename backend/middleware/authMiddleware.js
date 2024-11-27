const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports.auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], keys.jwtSecret);

        console.log('Decoded token:', decoded); 
        req.user = decoded; 
        next();
  } catch (err) {
      console.error('Invalid token:', err); 
      res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports.isMainAdmin = (req, res, next) => {
  const mainAdminEmail = 'admin@example.com';

  console.log('Decoded token in middleware:', req.user);

  if (req.user && req.user.role === 'admin' && req.user.email === mainAdminEmail) {
      return next();
  } else {
      console.error('Access denied:', req.user); 
      return res.status(403).json({ message: 'Access denied. Only the main admin can perform this action.' });
  }
};

