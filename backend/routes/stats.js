const express = require("express");
const axios = require("axios");
const User = require("../models/User");

const router = express.Router();

// Simple in-memory cache
let cache = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

// 🔐 Use your existing GitHub token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // make sure this is set in your .env

// Helper function to fetch *all* contributors (pagination-aware)
async function getAllContributors(contributorsUrl) {
  let page = 1;
  let allContributors = [];

  while (true) {
    const res = await axios.get(`${contributorsUrl}?per_page=100&page=${page}`, {
      headers: {
        "User-Agent": "DevSync-App",
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    allContributors = allContributors.concat(res.data);
    if (res.data.length < 100) break; // no more pages
    page++;
  }

  return allContributors.length;
}

router.get("/", async (req, res) => {
  try {
    if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
      return res.json(cache.data);
    }

    const totalUsers = await User.countDocuments();

    const GITHUB_API = "https://api.github.com/repos/DevSyncx/DevSync";
    const { data } = await axios.get(GITHUB_API, {
      headers: {
        "User-Agent": "DevSync-App",
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const contributors = await getAllContributors(data.contributors_url);

    const stats = {
      totalUsers,
      stars: data.stargazers_count,
      forks: data.forks_count,
      contributors,
    };

    cache = {
      data: stats,
      timestamp: Date.now(),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error.response?.data || error.message);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;
