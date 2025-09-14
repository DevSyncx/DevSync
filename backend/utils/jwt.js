const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    },
    process.env.JWT_SECRET || 'your_default_secret_key',
    { expiresIn: '7d' }
  );
};

/**
 * Verify a JWT token
 * @param {String} token - JWT token
 * @returns {Object|null} Decoded token or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret_key');
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};