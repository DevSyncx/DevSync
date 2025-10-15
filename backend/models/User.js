const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   googleId: {
    type: String,
    unique: true,
    sparse: true, // multiple nulls allowed
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true, // multiple nulls allowed
  },
  githubUsername: {
    type: String,
    sparse: true,
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
  accessToken: String, // Store OAuth access tokens (GitHub, Google)
  password: {
    type: String,
     required: function () {
      return !this.googleId && !this.githubId;
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
  
  // Platform-specific data (GitHub, LeetCode, etc.)
  platforms: [{
    name: {
      type: String,
      enum: ['GitHub', 'LeetCode', 'CodeForces', 'HackerRank', 'CodeChef', 'HackerEarth']
    },
    username: String,
    url: String,
    followers: Number,
    following: Number,
    repos: Number,
    contributions: Number,
    streak: Number,
    ranking: Number,
    score: Number,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],

  // ✅ Fields for forgot/reset password
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  date: {
    type: Date,
    default: Date.now
  }
});

// Static method to find or create a user by GitHub profile
UserSchema.statics.findOrCreateByGitHub = async function(profile, accessToken) {
  try {
    // Find existing user by githubId or email
    let user = await this.findOne({
      $or: [
        { githubId: profile.id },
        { email: profile.emails && profile.emails[0] ? profile.emails[0].value : null }
      ]
    });

    // If user exists, update GitHub information
    if (user) {
      user.githubId = profile.id;
      user.githubUsername = profile.username;
      user.name = user.name || profile.displayName || profile.username;
      user.accessToken = accessToken;
      
      // Update email if not already set
      if (!user.email && profile.emails && profile.emails[0]) {
        user.email = profile.emails[0].value;
      }
      
      // Update avatar if using default
      if (user.avatar === '/uploads/avatars/default-avatar.png' && profile.photos && profile.photos[0]) {
        user.avatar = profile.photos[0].value;
      }
      
      // Update GitHub in social links
      if (!user.socialLinks) user.socialLinks = {};
      user.socialLinks.github = profile._json?.html_url || `https://github.com/${profile.username}`;
      
      await user.save();
      return user;
    }
    
    // Create new user if not found
    const newUser = await this.create({
      githubId: profile.id,
      githubUsername: profile.username,
      name: profile.displayName || profile.username,
      email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.user`,
      avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '/uploads/avatars/default-avatar.png',
      accessToken: accessToken,
      isEmailVerified: true, // GitHub emails are verified
      socialLinks: {
        github: profile._json?.html_url || `https://github.com/${profile.username}`
      }
    });
    
    return newUser;
  } catch (err) {
    console.error('Error in findOrCreateByGitHub:', err);
    throw err;
  }
};

// Method to update GitHub data using the GitHub API
UserSchema.methods.updateGitHubData = async function(accessToken) {
  try {
    if (!this.githubUsername) return false;
    
    // Make API call to GitHub
    const response = await fetch(`https://api.github.com/users/${this.githubUsername}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${accessToken || this.accessToken}`
      }
    });
    
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const data = await response.json();
    
    // Find or create the GitHub platform entry
    let githubPlatform = this.platforms?.find(p => p.name === 'GitHub');
    
    if (!githubPlatform) {
      if (!this.platforms) this.platforms = [];
      this.platforms.push({
        name: 'GitHub',
        username: this.githubUsername,
        url: data.html_url,
        followers: data.followers || 0,
        following: data.following || 0,
        repos: data.public_repos || 0,
        lastUpdated: new Date()
      });
    } else {
      githubPlatform.followers = data.followers || 0;
      githubPlatform.following = data.following || 0;
      githubPlatform.repos = data.public_repos || 0;
      githubPlatform.lastUpdated = new Date();
    }
    
    await this.save();
    return true;
  } catch (err) {
    console.error('Error updating GitHub data:', err);
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);