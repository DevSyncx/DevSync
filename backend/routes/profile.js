const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const fs = require('fs');
const crypto = require('crypto');
const LeetCode = require("../models/Leetcode")

// Helper function to generate avatar URL from email or name
const generateAvatarUrl = (email, name) => {
  // Use email for consistent avatar, or fallback to name
  const identifier = email || name || 'user';
  const md5Hash = crypto.createHash('md5').update(identifier.toLowerCase().trim()).digest('hex');
  
  // Choose one of these services:
  // 1. Gravatar
  // const gravatarUrl = `https://www.gravatar.com/avatar/${md5Hash}?d=identicon&s=400`;
  
  // 2. DiceBear (more modern styled avatars)
  const diceBearStyle = 'micah'; // Options: avataaars, bottts, initials, micah, miniavs, etc.
  const diceBearUrl = `https://api.dicebear.com/6.x/${diceBearStyle}/svg?seed=${encodeURIComponent(identifier)}`;
  
  // 3. UI Avatars (text based)
  const uiAvatarsUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&size=128`;
  
  // Return your preferred avatar service
  return diceBearUrl;
};

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'User not found' }] });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// @route   POST api/profile/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    // If a file was uploaded, use that
    if (req.file) {
      // Delete old avatar if it's stored locally and not the default
      if (user.avatar && user.avatar.startsWith('/uploads/')) {
        const oldAvatarPath = path.join(__dirname, '..', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Update user with new avatar path
      const avatarPath = `/${req.file.path.replace(/\\/g, '/')}`;
      user.avatar = avatarPath;
    } 
    // Otherwise generate an avatar from dicebear or similar service
    else {
      const newAvatar = generateAvatarUrl(user.email, user.name);
      user.avatar = newAvatar;
    }
    
    await user.save();
    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    bio,
    location,
    skills,
    github,
    gitlab,
    linkedin,
    twitter,
    website,
    // Competitive coding platforms
    codechef,
    hackerrank,
    leetcode,
    codeforces,
    hackerearth
  } = req.body;

  // Build profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (bio) profileFields.bio = bio;
  if (location) profileFields.location = location;
  if (skills && Array.isArray(skills)) {
    profileFields.skills = skills;
  } else if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // Build social object
  profileFields.socialLinks = {};
  if (github) profileFields.socialLinks.github = github;
  if (gitlab) profileFields.socialLinks.gitlab = gitlab;
  if (linkedin) profileFields.socialLinks.linkedin = linkedin;
  if (twitter) profileFields.socialLinks.twitter = twitter;
  if (website) profileFields.socialLinks.website = website;
  
  // Add competitive coding platforms
  if (codechef) profileFields.socialLinks.codechef = codechef;
  if (hackerrank) profileFields.socialLinks.hackerrank = hackerrank;
  if (leetcode) profileFields.socialLinks.leetcode = leetcode;
  if (codeforces) profileFields.socialLinks.codeforces = codeforces;
  if (hackerearth) profileFields.socialLinks.hackerearth = hackerearth;

  try {
    let user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    // Update
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// Added a route to generate a new avatar from online services
router.post('/generate-avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    
    // Generate a new avatar using online service
    const newAvatar = generateAvatarUrl(user.email, user.name);
    user.avatar = newAvatar;
    await user.save();
    
    res.json({ avatar: newAvatar });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// @route   POST api/profile/projects
// @desc    Add project to profile
// @access  Private
router.post('/projects', [
  auth,
  [
    check('name', 'Project name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, link } = req.body;

  try {
    const user = await User.findById(req.user.id);

    user.projects.unshift({
      name,
      description,
      link
    });

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// @route   DELETE api/profile/projects/:proj_id
// @desc    Delete project from profile
// @access  Private
router.delete('/projects/:proj_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get remove index
    const removeIndex = user.projects
      .map(item => item.id)
      .indexOf(req.params.proj_id);

    if (removeIndex === -1) {
      return res.status(404).json({ errors: [{ msg: 'Project not found' }] });
    }
    
    user.projects.splice(removeIndex, 1);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server Error' }] });
  }
});

// @route   PUT api/profile/goals
// @desc    Update user goals
// @access  Private
router.put('/goals', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.goals = req.body.goals || [];
    await user.save();
    res.json(user.goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/profile/notes
// @desc    Update user notes
// @access  Private
router.put('/notes', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.notes = req.body.notes || "";
    await user.save();
    res.json(user.notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/profile/activity
// @desc    Update activity log (for heatmap)
// @access  Private
router.put('/activity', auth, async (req, res) => {
  try {
    const { date } = req.body; // expects YYYY-MM-DD or timestamp
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.activity.push(date);
    await user.save();
    res.json(user.activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/profile/time
// @desc    Update time spent
// @access  Private
router.put('/time', auth, async (req, res) => {
  try {
    const { timeSpent } = req.body; // e.g. "2h 30m"
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.timeSpent = timeSpent;
    await user.save();
    res.json(user.timeSpent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});




router.post("/leetcode/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await LeetCode.findOne({ username });
    if (existingUser) {
      return res.json({
        message: "LeetCode data fetched from database.",
        data: existingUser,
      });
    }

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query: `
          query LeetCodeProfile($username: String!, $limit: Int!) {
            matchedUser(username: $username) {
              username
              profile {
                ranking
                userAvatar
              }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              badges {
                id
                displayName
                icon
              }
              submissionCalendar
            }
            userContestRanking(username: $username) {
              attendedContestsCount
              rating
              globalRanking
              totalParticipants
              topPercentage
              badge {
                name
                icon
                expired
              }
            }
            userContestRankingHistory(username: $username) {
              attended
              rating
              contest {
                title
                startTime
              }
            }
            recentAcSubmissionList(username: $username, limit: $limit) {
              id
              title
              titleSlug
              timestamp
            }
          }
        `,
        variables: { username, limit: 10 },
      }),
    });

    let json;
    try {
      json = await response.json();
    } catch (err) {
      const text = await response.text();
      console.error("Invalid JSON from LeetCode API:", text.slice(0, 300));
      return res.status(500).json({ error: "Invalid JSON from LeetCode" });
    }

    if (!json.data?.matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const contestRanking = json.data.userContestRanking || {};
    const contestHistory = json.data.userContestRankingHistory || [];

    const result = {
      username: json.data.matchedUser.username,
      profile: {
        ranking: json.data.matchedUser.profile?.ranking,
        avatar: json.data.matchedUser.profile?.userAvatar,
      },
      submitStatsGlobal: json.data.matchedUser.submitStatsGlobal.acSubmissionNum.map(sub => ({
        difficulty: sub.difficulty,
        count: sub.count,
      })),
      badges: json.data.matchedUser.badges.map(badge => ({
        id: badge.id,
        displayName: badge.displayName,
        icon: badge.icon,
      })),
      submissionCalendar: JSON.parse(json.data.matchedUser.submissionCalendar || "{}"),
      recentSubmissions: json.data.recentAcSubmissionList.map(sub => ({
        id: sub.id,
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: new Date(sub.timestamp * 1000).toISOString(),
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
        contest: {
          title: contest.contest.title || "No Title",
          startTime: new Date(contest.contest.startTime * 1000).toISOString(),
        },
      })),
    };

    const newUser = await LeetCode.create(result);

    res.json({
      message: "LeetCode data fetched from API and saved to DB.",
      data: newUser,
    });
  } catch (err) {
    console.error("LeetCode API Error:", err);
    res.status(500).json({ error: "Failed to fetch or save LeetCode stats" });
  }
});



router.post("/leetcode/update/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const existingUser = await LeetCode.findOne({ username });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const timeDifference = Date.now() - new Date(existingUser.lastUpdated).getTime();
    const sixHoursInMillis = 6 * 60 * 60 * 1000; 

    if (timeDifference < sixHoursInMillis) {
      return res.json({
        message: "Profile is up-to-date. No update necessary.",
        data: existingUser,
      });
    }

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      body: JSON.stringify({
        query: `query LeetCodeProfile($username: String!, $limit: Int!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              userAvatar
            }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
            badges {
              id
              displayName
              icon
            }
            submissionCalendar
          }
          userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
              name
              icon
              expired
            }
          }
          userContestRankingHistory(username: $username) {
            attended
            rating
            contest {
              title
              startTime
            }
          }
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }`,
        variables: { username, limit: 10 },
      }),
    });

    let json;
    try {
      json = await response.json();
    } catch (err) {
      const text = await response.text();
      console.error("Invalid JSON from LeetCode API:", text.slice(0, 300));
      return res.status(500).json({ error: "Invalid JSON from LeetCode" });
    }

    if (!json.data?.matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const contestRanking = json.data.userContestRanking || {};
    const contestHistory = json.data.userContestRankingHistory || [];

    const result = {
      username: json.data.matchedUser.username,
      profile: {
        ranking: json.data.matchedUser.profile?.ranking,
        avatar: json.data.matchedUser.profile?.userAvatar,
      },
      submitStatsGlobal: json.data.matchedUser.submitStatsGlobal.acSubmissionNum.map(sub => ({
        difficulty: sub.difficulty,
        count: sub.count,
      })),
      badges: json.data.matchedUser.badges.map(badge => ({
        id: badge.id,
        displayName: badge.displayName,
        icon: badge.icon,
      })),
      submissionCalendar: JSON.parse(json.data.matchedUser.submissionCalendar || "{}"),
      recentSubmissions: json.data.recentAcSubmissionList.map(sub => ({
        id: sub.id,
        title: sub.title,
        titleSlug: sub.titleSlug,
        timestamp: new Date(sub.timestamp * 1000).toISOString(),
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
        contest: {
          title: contest.contest.title || "No Title",
          startTime: new Date(contest.contest.startTime * 1000).toISOString(),
        },
      })),
    };

    existingUser.profile = result.profile;
    existingUser.submitStatsGlobal = result.submitStatsGlobal;
    existingUser.badges = result.badges;
    existingUser.submissionCalendar = result.submissionCalendar;
    existingUser.recentSubmissions = result.recentSubmissions;
    existingUser.contestRating = result.contestRating;
    existingUser.contestHistory = result.contestHistory;
    existingUser.lastUpdated = new Date();

    await existingUser.save();

    res.json({
      message: "LeetCode data updated successfully.",
      data: existingUser,
    });
  } catch (err) {
    console.error("LeetCode API Error:", err);
    res.status(500).json({ error: "Failed to fetch or update LeetCode stats" });
  }
});


module.exports = router;