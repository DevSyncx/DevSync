const jwt = require('jsonwebtoken');
require('dotenv').config();

// Use a fallback JWT secret if env variable is missing
const JWT_SECRET = process.env.JWT_SECRET || 'devsync_secure_jwt_secret_key_for_authentication';

module.exports = function(req, res, next) {
  // Check if user is authenticated via Passport session (GitHub, Google)
  if (req.isAuthenticated && req.isAuthenticated()) {
    console.log('User authenticated via session:', req.user);
    return next();
  }
  
  // Get token from header for JWT auth
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ errors: [{ msg: 'No authentication, authorization denied' }] });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
  }
};