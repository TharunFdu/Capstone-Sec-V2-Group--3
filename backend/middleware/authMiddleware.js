const jwt = require('jsonwebtoken');
const keys = require('../config/keys');  

module.exports.auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], keys.jwtSecret);  
        req.user = decoded;  
        next();  
    } catch (err) {
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
