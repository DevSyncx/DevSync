const { sendVerificationEmail } = require('../services/emailService')
const crypto = require("crypto");
const jwt = require('jsonwebtoken'); // Also add this if missing

// Use a fallback JWT secret if env variable is missing
const JWT_SECRET = process.env.JWT_SECRET || 'devsync_secure_jwt_secret_key_for_authentication';

// Helper function to generate verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Helper function to generate JWT token
const generateJWT = (userId, expiresIn = "24h") => {
  return new Promise((resolve, reject) => {
    const payload = {
      user: {
        id: userId,
      },
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

// Helper function to format user response
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
  };
};

// Helper function to set verification token on user
const setVerificationToken = async (user) => {
  const verificationCode = generateVerificationCode();
  user.emailVerificationToken = verificationCode;
  user.emailVerificationExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();
  return verificationCode;
};

// Helper function to send verification email with error handling
const handleVerificationEmail = async (email, verificationCode) => {
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