const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} googleId - Google OAuth ID (optional)
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {boolean} isEmailVerified - Email verification status
 * @property {string} password - Hashed password (required if no googleId)
 * @property {string} avatar - Path to user's avatar image
 * @property {string} bio - User's biography
 * @property {string[]} skills - Array of user's skills
 * @property {Object} socialLinks - User's social media profiles
 */
const UserSchema = new Schema({
   googleId: {
    type: String,
    unique: true,
    sparse: true, // multiple nulls allowed
  },
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  isEmailVerified: {
    type: Boolean,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  password: {
    type: String,
     required: function () {
      return !this.googleId;
     },
  },
  avatar: {
    type: String,
    default: '/uploads/avatars/default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String
  },
  skills: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 20; // Maximum 20 skills
      },
      message: 'Cannot have more than 20 skills'
    }
  },
  socialLinks: {
    github: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/github\.com\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid GitHub URL format'
      }
    },
    gitlab: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/gitlab\.com\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid GitLab URL format'
      }
    },
    linkedin: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid LinkedIn URL format'
      }
    },
    twitter: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/(?:www\.)?twitter\.com\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid Twitter URL format'
      }
    },
    website: String,
    codechef: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/www\.codechef\.com\/users\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid CodeChef URL format'
      }
    },
    hackerrank: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/www\.hackerrank\.com\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid HackerRank URL format'
      }
    },
    leetcode: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/leetcode\.com\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid LeetCode URL format'
      }
    },
    codeforces: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/codeforces\.com\/profile\/[\w-]+\/?$/.test(v);
        },
        message: 'Invalid Codeforces URL format'
      }
    },
    hackerearth: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https:\/\/www\.hackerearth\.com\/@[\w-]+\/?$/.test(v);
        },
        message: 'Invalid HackerEarth URL format'
      }
    }
  },
  projects: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      link: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // ✅ New fields for dashboard
  streak: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: String,
    default: "0 minutes"
  },
  activity: {
    type: [Object], // e.g. [{ date: '2025-08-27', count: 3 }]
    default: []
  },
  goals: {
    type: [String],
    default: []
  },

  // ✅ Fields for forgot/reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
