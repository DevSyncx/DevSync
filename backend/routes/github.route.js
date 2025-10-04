// routes/github.route.js
const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const router = express.Router();

// Helper function to run GraphQL query
const runGraphQL = async (query, variables = {}) => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GitHub token not configured in environment variables");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  return data.data;
};

// GET /api/github/:username
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const query = `
      query($login: String!) {
        user(login: $login) {
          login
          name
          avatarUrl
          bio
          followers { totalCount }
          following { totalCount }
          repositories(
            first: 50,
            privacy: PUBLIC,
            isFork: false,
            orderBy: { field: STARGAZERS, direction: DESC }
          ) {
            nodes {
              name
              url
              description
              stargazerCount
              forkCount
              languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                }
              }
            }
            totalCommitContributions
          }
        }
      }
    `;

    const data = await runGraphQL(query, { login: username });
    const user = data.user;

    if (!user) return res.status(404).json({ error: "User not found" });

    // Aggregate top 6 repos by stars
    const topRepos = user.repositories.nodes
      .sort((a, b) => b.stargazerCount - a.stargazerCount)
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        url: r.url,
        description: r.description,
        stars: r.stargazerCount,
        forks: r.forkCount,
        languages: r.languages.edges.map((edge) => ({
          name: edge.node.name,
          size: edge.size,
        })),
      }));

    // Aggregate languages across all repos by size → return array
    const languages = {};
    user.repositories.nodes.forEach((repo) => {
      repo.languages.edges.forEach(({ node, size }) => {
        languages[node.name] = (languages[node.name] || 0) + size;
      });
    });
    const languagesArray = Object.entries(languages).map(([name, size]) => ({
      name,
      size,
    }));

    // Flatten contribution days for easier frontend rendering
    const allContributionDays = [];
    user.contributionsCollection.contributionCalendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        allContributionDays.push(day);
      });
    });

    res.json({
      profile: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
      },
      topRepos,
      contributions: {
        totalContributions:
          user.contributionsCollection.contributionCalendar.totalContributions,
        totalCommits: user.contributionsCollection.totalCommitContributions,
        heatmap: allContributionDays, // flattened heatmap array
      },
      languages: languagesArray, // array for frontend use
    });
  } catch (err) {
    console.error("GitHub API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
