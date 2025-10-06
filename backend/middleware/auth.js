const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "devsync_secure_jwt_secret_key_for_authentication";

module.exports = async function (req, res, next) {
  try {
    const token = req.header("x-auth-token");

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.user.id).select("-password");
        if (!user) return res.status(401).json({ errors: [{ msg: "Unauthorized user" }] });

        req.user = user;
        req.authMethod = "token";
        return next();
      } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(401).json({ errors: [{ msg: "Token is not valid" }] });
      }
    }

    if (req.isAuthenticated && req.isAuthenticated()) {
      req.user = req.user;
      req.authMethod = "session";
      return next();
    }

    return res.status(401).json({ errors: [{ msg: "Not authenticated" }] });
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};
