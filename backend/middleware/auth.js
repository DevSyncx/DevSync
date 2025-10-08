const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Use a fallback JWT secret if env variable is missing
const JWT_SECRET = process.env.JWT_SECRET || 'devsync_secure_jwt_secret_key_for_authentication';

module.exports = async function(req, res, next) {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account is deactivated. Please contact support to reactivate.',
        accountStatus: 'deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};