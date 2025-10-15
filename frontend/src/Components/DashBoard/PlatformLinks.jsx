import {
  SiCodechef,
  SiHackerrank,
  SiLeetcode,
  SiHackerearth,
  SiGithub,
} from "react-icons/si";

const iconMap = {
  codechef: SiCodechef,
  hackerrank: SiHackerrank,
  hackerearth: SiHackerearth,
  github: SiGithub,
  leetcode: SiLeetcode,
};

function normalizeLeetcodeURL(url) {
  if (!url || typeof url !== 'string') return null;
  const leetcodeRegex =
    /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/;
  if (!leetcodeRegex.test(url)) return null;
  return url.replace(/\/$/, "");
}

function normalizeGitHubURL(url) {
  if (!url || typeof url !== 'string' || url.trim() === "") return null;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
  if (!githubRegex.test(url)) return null;

  const username = url.replace(/\/$/, "").split("/").pop();
  return username;
}

const leetcodeUrl = (url) => {
  if (!url || typeof url !== 'string') return "#";
  const normalized = normalizeLeetcodeURL(url);
  if (!normalized) return "#";
  const username = normalized.trim().split("/").pop();
  return `/leetcode/${username}`;
};

const githubUrl = (url) => {
  if (!url || typeof url !== 'string') return "#";
  const username = url.replace(/\/$/, "").split("/").pop();
  return `/dashboard/github/${username}`;
};

export default function PlatformLinks({ platforms = {} }) {
  // Get platform entries if they exist, otherwise default to GitHub
  let platformEntries = [];
  
  if (Array.isArray(platforms)) {
    // Handle array format (from GitHub auth)
    platformEntries = platforms.map(platform => [platform.name.toLowerCase(), platform.url]);
  } else {
    // Handle object format (from email auth)
    platformEntries = Object.entries(platforms || {}).filter(
      ([, url]) => url && typeof url === 'string' && url.trim() !== ""
    );
  }
  
  // If no platforms, ensure at least GitHub shows up for consistent UI
  if (platformEntries.length === 0) {
    platformEntries = [["github", "https://github.com/"]];
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {platformEntries.map(([name, url], i) => {
        const Icon = iconMap[name.toLowerCase()] || SiGithub;

        return (
          <a
            key={i}
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[var(--card)] rounded-lg p-3 shadow-sm hover:shadow-md transition"
          >
            <Icon className="w-4 h-4 text-[var(--primary)]" />
            <div className="flex flex-col text-sm">
              <span className="text-xs text-[var(--primary)] capitalize">
                {name}
              </span>
              <span className="text-sm text-[var(--muted-foreground)]">
                Active
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}