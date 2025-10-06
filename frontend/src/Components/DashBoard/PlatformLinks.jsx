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
  const leetcodeRegex =
    /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/;
  if (!leetcodeRegex.test(url)) return null;
  return url.replace(/\/$/, "");
}

function normalizeGitHubURL(url) {
  if (!url || url.trim() === "") return null;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
  if (!githubRegex.test(url)) return null;

  const username = url.replace(/\/$/, "").split("/").pop();
  return username;
}

const leetcodeUrl = (url) => {
  const normalized = normalizeLeetcodeURL(url);
  if (!normalized) return "#";
  const username = normalized.trim().split("/").pop();
  return `/leetcode/${username}`;
};

const githubUrl = (url) => {
  if (!url) return "#";
  const username = url.replace(/\/$/, "").split("/").pop();
  return `/dashboard/github/${username}`;
};

export default function PlatformLinks({ platforms }) {
  // Filter out empty or falsy URLs
  const platformEntries = Object.entries(platforms).filter(
    ([, url]) => url && url.trim() !== ""
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      {platformEntries.length > 0 ? (
        platformEntries.map(([name, url], i) => {
          const Icon = iconMap[name.toLowerCase()] || SiGithub;

          // Determine href based on platform
          const href =
            name.toLowerCase() === "leetcode"
              ? leetcodeUrl(url)
              : name.toLowerCase() === "github"
              ? githubUrl(normalizeGitHubURL(url))
              : url;

          return (
            <a
              key={i}
              href={href}
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
        })
      ) : (
        <div className="flex items-center justify-center col-span-2 bg-[var(--card)] rounded-lg p-3 shadow-sm">
          <span className="text-sm text-[var(--muted-foreground)] italic">
            No platforms linked yet
          </span>
        </div>
      )}
    </div>
  );
}
