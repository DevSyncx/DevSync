const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: String
  },
  location: {
    type: String
  },
  skills: {
    type: [String]
  },
  socialLinks: {
    github: String,
    gitlab: String,
    linkedin: String,
    twitter: String,
    website: String,
    codechef: String,
    hackerrank: String,
    leetcode: String,
    codeforces: String,
    hackerearth: String
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
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deactivatedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Add method to safely delete user data
UserSchema.methods.softDelete = function() {
  this.isActive = false;
  this.deletedAt = new Date();
  return this.save();
};

// Add method to deactivate account
UserSchema.methods.deactivate = function() {
  this.isActive = false;
  this.deactivatedAt = new Date();
  return this.save();
};

// Add method to reactivate account
UserSchema.methods.reactivate = function() {
  this.isActive = true;
  this.deactivatedAt = null;
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);
