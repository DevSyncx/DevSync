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

// Start GitHub OAuth flow
router.get(
  "/github",
  (req, res, next) => {
    console.log("GitHub auth route hit");
    // Store where the user came from (register or login) in the session
    if (req.query.from) {
      req.session.authFrom = req.query.from;
      console.log(`Auth request from: ${req.query.from}`);
    }
    next();
  },
  passport.authenticate("github", { 
    scope: ["user:email", "read:user", "public_repo", "read:org", "user:follow"]
  })
);

// Handle callback from GitHub
router.get(
  "/github/callback",
  (req, res, next) => {
    console.log("GitHub callback received");
    next();
  },
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/register?error=github_auth`, // redirect back to register with an error
    session: true,
    failWithError: true,
    passReqToCallback: true
  }),
  (req, res) => {
    console.log("GitHub auth successful, user:", req.user);
    
    // Get the access token from the authentication process
    const accessToken = req.authInfo?.accessToken;
    
    // Store the token explicitly in the user object and the session
    if (accessToken) {
      req.user.accessToken = accessToken;
      // Also store in session directly as a backup
      req.session.accessToken = accessToken;
      console.log("Access token stored from authInfo");
    } else if (req.user._json?.accessToken) {
      req.user.accessToken = req.user._json.accessToken;
      req.session.accessToken = req.user._json.accessToken;
      console.log("Access token stored from _json");
    }
    
    // Store GitHub authentication info in the session
    req.session.authMethod = 'github';
    req.session.isAuthenticated = true;
    
    // For debugging
    console.log("Final user object with accessToken:", 
      req.user.accessToken ? "Token available" : "Token missing");
    
    // Explicitly grab the access token from the strategy's authentication context
    // This hack is needed because different passport strategies handle token passing differently
    if (!req.user.accessToken) {
      // Assume the access token is in the session context
      // Look for it in the passport strategy's private state
      if (req._passport && req._passport.session && req._passport.session.user) {
        req.user.accessToken = req.query.access_token;
        console.log("Extracted access token from URL params:", !!req.user.accessToken);
      }
    }
    
    req.session.save(err => {
      if (err) {
        console.error("Error saving session:", err);
      }
      // ✅ Successful authentication → redirect to frontend home page
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${encodeURIComponent(req.user.accessToken || '')}`);
    });
  },
  (err, req, res, next) => {
    console.error("GitHub auth error:", err);
    
    // Redirect based on where the auth request came from
    const authFrom = req.session.authFrom || 'login';
    console.log(`Auth error, redirecting to ${authFrom} page`);
    
    res.redirect(`${process.env.CLIENT_URL}/${authFrom}?error=github`);
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

// @route   POST api/auth/forgot-password
// @desc    Send password reset link
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendVerificationEmail(
      user.email,
      "Password Reset Request",
      `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`
    );

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});


// @route   POST api/auth/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid or expired reset token" }] });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});


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
    console.log("User is authenticated via session:", req.user);
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// @route   GET api/auth/check
// @desc    Check if user is authenticated (works for both JWT and session auth)
// @access  Public
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ 
      isAuthenticated: true, 
      authMethod: 'session',
      user: req.user
    });
  }
  
  const token = req.header('x-auth-token');
  if (token) {
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'devsync_secure_jwt_secret_key_for_authentication';
      const decoded = jwt.verify(token, JWT_SECRET);
      return res.json({ 
        isAuthenticated: true, 
        authMethod: 'token',
        user: decoded.user
      });
    } catch (err) {
      console.error('Token verification error:', err.message);
    }
  }
  
  res.json({ isAuthenticated: false });
});

module.exports = router;