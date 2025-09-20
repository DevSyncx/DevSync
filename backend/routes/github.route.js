const express = require("express");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const router = express.Router();

// Helper function to run GraphQL query
const runGraphQL = async (query, variables = {}) => {
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
            first: 100,
            privacy: PUBLIC,
            isFork: false,
            orderBy: {field: STARGAZERS, direction: DESC}
          ) {
            nodes {
              name
              url
              description
              stargazerCount
              forkCount
              primaryLanguage { name }
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
      .slice(0, 6);

    // Aggregate languages
    const languages = {};
    user.repositories.nodes.forEach((r) => {
      if (r.primaryLanguage?.name) {
        languages[r.primaryLanguage.name] = (languages[r.primaryLanguage.name] || 0) + 1;
      }
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
      topRepos: topRepos.map((r) => ({
        name: r.name,
        url: r.url,
        description: r.description,
        stars: r.stargazerCount,
        forks: r.forkCount,
        language: r.primaryLanguage?.name || "Unknown",
      })),
      contributions: {
        totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
        totalCommits: user.contributionsCollection.totalCommitContributions,
        weeks: user.contributionsCollection.contributionCalendar.weeks,
      },
      languages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
