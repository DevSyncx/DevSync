const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const User = require('../models/User');
const LeetCode = require("../models/Leetcode");

// Helper to generate avatar URL
const generateAvatarUrl = (email, name) => {
  const identifier = email || name || 'user';
  const diceBearStyle = 'micah';
  return `https://api.dicebear.com/6.x/${diceBearStyle}/svg?seed=${encodeURIComponent(identifier)}`;
};

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb('Error: Images Only!');
  }
});

// ---------------------- ROUTES ----------------------

// Get profile (dev mode: fetch first user)
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.status(404).json({ errors: [{ msg: 'No user found' }] });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });

    if (req.file) {
      // Delete old local avatar
      if (user.avatar && user.avatar.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
    } else {
      user.avatar = generateAvatarUrl(user.email, user.name);
    }

    await user.save();
    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// Update profile
router.put('/', [
  check('name', 'Name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    name, bio, location, skills, github, gitlab, linkedin, twitter, website,
    codechef, hackerrank, leetcode, codeforces, hackerearth
  } = req.body;

  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });

    // Update fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

    user.socialLinks = {
      github, gitlab, linkedin, twitter, website,
      codechef, hackerrank, leetcode, codeforces, hackerearth
    };

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// Generate new avatar
router.post('/generate-avatar', async (req, res) => {
  try {
    const user = await User.findOne().select('-password');
    if (!user) return res.status(404).json({ errors: [{ msg: 'User not found' }] });

    const newAvatar = generateAvatarUrl(user.email, user.name);
    user.avatar = newAvatar;
    await user.save();
    res.json({ avatar: newAvatar });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// ---------------- LEETCODE ROUTES (unchanged) ----------------

router.post("/leetcode/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const existingUser = await LeetCode.findOne({ username });
    if (existingUser) return res.json({ message: "LeetCode data fetched from DB", data: existingUser });

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify({
        query: `
          query LeetCodeProfile($username: String!, $limit: Int!) {
            matchedUser(username: $username) {
              username profile { ranking userAvatar }
              submitStatsGlobal { acSubmissionNum { difficulty count } }
              badges { id displayName icon }
              submissionCalendar
            }
            userContestRanking(username: $username) { attendedContestsCount rating globalRanking totalParticipants topPercentage badge { name icon expired } }
            userContestRankingHistory(username: $username) { attended rating contest { title startTime } }
            recentAcSubmissionList(username: $username, limit: $limit) { id title titleSlug timestamp }
          }
        `,
        variables: { username, limit: 10 },
      }),
    });

    let json;
    try { json = await response.json(); }
    catch { return res.status(500).json({ error: "Invalid JSON from LeetCode" }); }

    if (!json.data?.matchedUser) return res.status(404).json({ error: "User not found" });

    const contestRanking = json.data.userContestRanking || {};
    const contestHistory = json.data.userContestRankingHistory || [];

    const result = {
      username: json.data.matchedUser.username,
      profile: { ranking: json.data.matchedUser.profile?.ranking, avatar: json.data.matchedUser.profile?.userAvatar },
      submitStatsGlobal: json.data.matchedUser.submitStatsGlobal.acSubmissionNum.map(sub => ({ difficulty: sub.difficulty, count: sub.count })),
      badges: json.data.matchedUser.badges.map(badge => ({ id: badge.id, displayName: badge.displayName, icon: badge.icon })),
      submissionCalendar: JSON.parse(json.data.matchedUser.submissionCalendar || "{}"),
      recentSubmissions: json.data.recentAcSubmissionList.map(sub => ({
        id: sub.id, title: sub.title, titleSlug: sub.titleSlug, timestamp: new Date(sub.timestamp * 1000).toISOString()
      })),
      contestRating: {
        attendedContestsCount: contestRanking.attendedContestsCount || 0,
        rating: contestRanking.rating || 0,
        globalRanking: contestRanking.globalRanking || 0,
        totalParticipants: contestRanking.totalParticipants || 0,
        topPercentage: contestRanking.topPercentage || 0,
        badge: {
          name: contestRanking.badge?.name || "No Badge",
          icon: contestRanking.badge?.icon || "/default_icon.png",
          expired: contestRanking.badge?.expired || false,
        },
      },
      contestHistory: contestHistory.map(contest => ({
        attended: contest.attended || false,
        rating: contest.rating || 0,
        contest: { title: contest.contest.title || "No Title", startTime: new Date(contest.contest.startTime * 1000).toISOString() }
      }))
    };

    const newUser = await LeetCode.create(result);
    res.json({ message: "LeetCode data fetched from API and saved to DB.", data: newUser });
  } catch (err) {
    console.error("LeetCode API Error:", err);
    res.status(500).json({ error: "Failed to fetch or save LeetCode stats" });
  }
});

router.post("/leetcode/update/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const existingUser = await LeetCode.findOne({ username });
    if (!existingUser) return res.status(404).json({ error: "User not found in DB" });

    const sixHoursInMillis = 6 * 60 * 60 * 1000;
    if (Date.now() - new Date(existingUser.lastUpdated).getTime() < sixHoursInMillis) {
      return res.json({ message: "Profile up-to-date.", data: existingUser });
    }

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
      body: JSON.stringify({ query: `...`, variables: { username, limit: 10 } }),
    });

    const json = await response.json();
    if (!json.data?.matchedUser) return res.status(404).json({ error: "User not found" });

    // Update DB fields
    existingUser.profile = json.data.matchedUser.profile;
    existingUser.submitStatsGlobal = json.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    existingUser.badges = json.data.matchedUser.badges;
    existingUser.submissionCalendar = JSON.parse(json.data.matchedUser.submissionCalendar || "{}");
    existingUser.lastUpdated = new Date();
    await existingUser.save();

    res.json({ message: "LeetCode data updated successfully.", data: existingUser });
  } catch (err) {
    console.error("LeetCode API Error:", err);
    res.status(500).json({ error: "Failed to fetch/update LeetCode stats" });
  }
});

module.exports = router;
