const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const fs = require('fs');
const crypto = require('crypto');

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

module.exports = router;