const { getOctokit } = require("@actions/github");
const { google } = require("googleapis");

const repo = process.env.GITHUB_REPO;
const [owner, repoName] = repo.split("/");
const octokit = getOctokit(process.env.GITHUB_TOKEN);

// Points mapping
const LEVEL_POINTS = {
  level1: 3,
  level2: 7,
  level3: 10,
};

// Normalize labels → works with "Level 1", "level-1", "LEVEL 2", etc.
function normalizeLabel(label) {
  return label
    .toLowerCase()
    .replace(/\s+/g, "")   // remove spaces
    .replace(/-/g, "");    // remove dashes
}

async function fetchAllPRs() {
  let contributors = {};

  const prs = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo: repoName,
    state: "closed",
    per_page: 100,
  });

  prs.forEach(pr => {
    if (!pr.merged_at) return; // only merged PRs

    const labels = pr.labels.map(l => normalizeLabel(l.name));
    let level = labels.find(l => l.startsWith("level"));
    if (!level) return;

    const points = LEVEL_POINTS[level] || 0;
    const user = pr.user.login;

    if (!contributors[user]) {
      contributors[user] = { prs: [], levels: [], total: 0 };
    }

    contributors[user].prs.push(pr.number);
    contributors[user].levels.push(level);
    contributors[user].total += points;
  });

  return contributors;
}

async function updateGoogleSheet(contributors) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || "./credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  let rows = [["Username", "PR Numbers", "Levels", "Total Points"]];
  for (let [user, data] of Object.entries(contributors)) {
    rows.push([
      user,
      data.prs.join(", "),
      data.levels.join(", "),
      data.total,
    ]);
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: { values: rows },
  });

  console.log("✅ Contributor Leaderboard updated!");
}

(async () => {
  const contributors = await fetchAllPRs();
  await updateGoogleSheet(contributors);
})();
