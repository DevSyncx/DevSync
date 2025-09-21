const { sendVerificationEmail } = require('../services/emailService');
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

// Use a fallback JWT secret if env variable is missing
const JWT_SECRET = process.env.JWT_SECRET || 'devsync_secure_jwt_secret_key_for_authentication';

/**
 * Generate a 6-digit verification code
 */
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate JWT token for a user
 * @param {String} userId - User ID
 * @param {String} expiresIn - Token expiration
 */
const generateJWT = (userId, expiresIn = "24h") => {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

/**
 * Format user object to send in response
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  isEmailVerified: user.isEmailVerified,
});

/**
 * Set verification token and expiration on user
 */
const setVerificationToken = async (user) => {
  const verificationCode = generateVerificationCode();
  user.emailVerificationToken = verificationCode;
  user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();
  return verificationCode;
};

/**
 * Send verification email or log code in development
 */
const handleVerificationEmail = async (email, verificationCode) => {
  if (process.env.NODE_ENV === "development") {
    // Log verification code in dev instead of sending email
    console.log(`[DEV] Verification code for ${email}: ${verificationCode}`);
    return; // skip sending email
  }

  try {
    await sendVerificationEmail(email, verificationCode);
    console.log(`Verification code for ${email}: ${verificationCode}`);
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
    throw emailError;
  }
};

module.exports = {
  generateVerificationCode,
  generateJWT,
  formatUserResponse,
  setVerificationToken,
  handleVerificationEmail
};
