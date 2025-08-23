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
    // Competitive coding platforms
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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
