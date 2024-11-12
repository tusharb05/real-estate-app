const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config/config');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  // If no token is found
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findOne({ where: { id: decoded.sub } });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
