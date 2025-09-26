const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../models/User");
const crypto = require("crypto");
require("dotenv").config();
const passport = require("passport");
const { sendVerificationEmail } = require("../services/emailService");
const { generateVerificationCode, generateJWT, formatUserResponse, setVerificationToken, handleVerificationEmail } = require("../utils/emailVerificationHelpers")

// Helper function to generate avatar URL from email or name
const generateAvatarUrl = (email, name) => {
  // Use email for consistent avatar, or fallback to name
  const identifier = email || name || "user";
  const md5Hash = crypto
    .createHash("md5")
    .update(identifier.toLowerCase().trim())
    .digest("hex");

  // DiceBear (modern styled avatars)
  const diceBearStyle = "micah"; // Options: avataaars, bottts, initials, micah, miniavs, etc.
  const diceBearUrl = `https://api.dicebear.com/6.x/${diceBearStyle}/svg?seed=${encodeURIComponent(
    identifier
  )}`;

  return diceBearUrl;
};

// Use a fallback JWT secret if env variable is missing
const JWT_SECRET =
  process.env.JWT_SECRET || "devsync_secure_jwt_secret_key_for_authentication";

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle callback from Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // if auth fails → go to login
    session: true,
  }),
  (req, res) => {
    // ✅ Successful authentication → redirect to frontend home page
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);

    // ⬆️ change port if your React app runs elsewhere
  }
);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        if (!user.isEmailVerified) {
          // Resend verification for unverified user
          const verificationCode = await setVerificationToken(user);
          await handleVerificationEmail(email, verificationCode);

          return res.status(200).json({
            message:
              "User already exists but not verified. Verification email sent again.",
            userId: user._id,
            needsVerification: true,
          });
        } else {
            return res.status(500).json({ errors: [{ msg: "User already exists. Please Sign in!!" }] });
        }
      }

      // Create new user
      const avatarUrl = generateAvatarUrl(email, name);
      const verificationCode = generateVerificationCode();

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        name,
        email,
        password: hashedPassword,
        avatar: avatarUrl,
        isEmailVerified: false,
        emailVerificationToken: verificationCode,
        emailVerificationExpires: Date.now() + 15 * 60 * 1000,
      });

      await user.save();

      // Send verification email
      await handleVerificationEmail(email, verificationCode);

      res.status(201).json({
        message: "User created successfully. Please verify your email.",
        userId: user._id,
        needsVerification: true,
        email: user.email,
      });

    } catch (err) {
      console.error(err.message);
      if(err.message === 'Invalid Email ID')
      {
        return res.status(400).json({ errors: [{ msg: "Invalid Email ID" }] });
      }
      return res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route   POST api/auth/verify-email
// @desc    Verify user email with code
// @access  Public
router.post("/verify-email", async (req, res) => {
  const { userId, verificationCode } = req.body;

  try {
    if (!userId || !verificationCode) {
      return res.status(400).json({
        errors: [{ msg: "User ID and verification code are required" }],
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found" }],
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        errors: [{ msg: "Email is already verified" }],
      });
    }

    // Check if code is valid
    if (user.emailVerificationToken !== verificationCode) {
      return res.status(400).json({
        errors: [{ msg: "Invalid verification code" }],
      });
    }

    if (user.emailVerificationExpires < Date.now()) {
      return res.status(400).json({
        errors: [
          { msg: "Verification code has expired. Please request a new one." },
        ],
      });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Generate JWT token after successful verification
    try {
      const token = await generateJWT(user.id);
      res.json({
        message: "Email verified successfully!!",
        token,
        user: formatUserResponse(user),
      });
    } catch (jwtError) {
      console.error("JWT generation error:", jwtError);
      res.status(500).json({ errors: [{ msg: "Error generating token" }] });
    }

  } catch (err) {
    console.error("Email verification error:", err.message);
    res
      .status(500)
      .json({ errors: [{ msg: "Server error during verification" }] });
  }
});

// @route   POST api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post("/resend-verification", async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User not found" }],
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        errors: [{ msg: "Email is already verified" }],
      });
    }

    // Generate and set new verification code
    const verificationCode = await setVerificationToken(user);

    // Send verification email
    try {
      await handleVerificationEmail(user.email, verificationCode);
      res.json({
        message: "Verification code sent successfully to your email.",
      });
    } catch (emailError) {
      console.error("Email resend failed:", emailError);
      return res.status(500).json({
        errors: [
          { msg: "Failed to send verification email. Please try again." },
        ],
      });
    }

  } catch (err) {
    console.error("Resend verification error:", err.message);
    res.status(500).json({ errors: [{ msg: "Server error during resend" }] });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User not found. Please Sign up first!!" }] });
      } 

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      if (!user.isEmailVerified) {
        return res.status(400).json({
          errors: [{ msg: "Please verify your email before logging in" }],
          requiresVerification: true,
          userId: user._id,
          email: user.email,
        });
      } else {
        // Generate JWT token
        try {
          const token = await generateJWT(user.id);
          res.json({
            message: "Login successful",
            token,
            user: formatUserResponse(user),
          });
        } catch (jwtError) {
          console.error("JWT generation error:", jwtError);
          res.status(500).json({ errors: [{ msg: "Error generating token" }] });
        }
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

// @route   GET api/auth
// @desc    Get user data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
});

// @route   GET api/auth/me
// @desc    Get authenticated user data
// @access  Private
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

module.exports = router;