import React from "react";
import {
  SiLeetcode,
  SiCodechef,
  SiHackerrank,
  SiGithub,
  SiHackerearth,
  SiLinkedin,
} from "react-icons/si";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/Components/ui/Card";

const iconMap = {
  leetcode: SiLeetcode,
  codechef: SiCodechef,
  hackerrank: SiHackerrank,
  hackerearth: SiHackerearth,
  github: SiGithub,
  linkedin: SiLinkedin,
};

export default function ProfileCard({ user }) {
  if (!user) return null;

  const socialLinks = user.socialLinks || {};
  const entries = Object.entries(socialLinks).filter(
    ([_, url]) => url?.trim() !== ""
  );

  const normalizeLeetcodeURL = (url) => {
    const regex = /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/;
    if (!regex.test(url)) return null;
    return url.replace(/\/$/, "");
  };

  const normalizeGitHubURL = (url) => {
    const regex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    if (!regex.test(url)) return null;
    return url.replace(/\/$/, "");
  };

  const leetcodeUrl = (url) => {
    const normalized = normalizeLeetcodeURL(url);
    if (!normalized) return "#";
    const username = normalized.split("/").pop();
    return `/leetcode/${username}`;
  };

  const githubUrl = (url) => {
    if (!url) return "#";
    const username = normalizeGitHubURL(url)?.split("/").pop();
    return `/dashboard/github/${username}`;
  };

  return (
    <Card className="w-full sm:w-auto hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ring-2 ring-[var(--primary)]">
          <img
            src={
              user.avatar
                ? user.avatar.startsWith("http")
                  ? user.avatar
                  : `${import.meta.env.VITE_API_URL}${user.avatar}`
                : `https://api.dicebear.com/6.x/micah/svg?seed=fallback`
            }
            alt={user.name}
            className="w-16 h-16 object-cover rounded-full"
          />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[var(--primary)]">
            {user.name}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
        </div>
      </CardHeader>

      <CardContent>
        <CardFooter className="flex flex-col gap-3">
          <p className="text-md font-medium text-[var(--primary)] mb-2">
            Platforms
          </p>
          {entries.length > 0 ? (
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              {entries.map(([platform, url]) => {
                const Icon = iconMap[platform.toLowerCase()];
                if (!Icon) return null;

                let href = url;
                if (platform.toLowerCase() === "leetcode")
                  href = leetcodeUrl(url);
                if (platform.toLowerCase() === "github") href = githubUrl(url);

                return (
                  <a
                    key={platform}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-md bg-[var(--secondary)] shadow-sm hover:shadow-md hover:scale-105 transition-transform duration-200"
                    title={platform}
                  >
                    <Icon className="w-6 h-6 text-[var(--primary)]" />
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)] italic">
              No platforms linked yet
            </p>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
