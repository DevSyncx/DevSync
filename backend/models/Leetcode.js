const mongoose = require("mongoose");

const leetcodeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    profile: {
      ranking: Number,
      avatar: String,
    },
    submitStatsGlobal: [
      {
        difficulty: String,
        count: Number,
      },
    ],
    badges: [
      {
        id: String,
        displayName: String,
        icon: String,
      },
    ],
    submissionCalendar: {
      type: Map,
      of: String,
    },
    recentSubmissions: [
      {
        id: String,
        title: String,
        titleSlug: String,
        timestamp: Date,
      },
    ],
    contestRating: {
      attendedContestsCount: Number,
      rating: Number,
      globalRanking: Number,
      totalParticipants: Number,
      topPercentage: Number,
      badge: {
        name: String,
        icon: String,
        expired: Boolean,
      },
    },
    contestHistory: [
      {
        attended: Boolean,
        rating: Number,
        contest: {
          title: String,
          startTime: Date,
        },
      },
    ],
    lastUpdated: { type: Date, default: Date.now },
  },
  
  { timestamps: true }
);

const LeetCode = mongoose.model("LeetCode", leetcodeSchema);

module.exports = LeetCode;
