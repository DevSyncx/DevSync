import { User } from "lucide-react";
import React from "react";
import CardWrapper from "./CardWrapper";
import {
  SiLeetcode,
  SiCodechef,
  SiHackerrank,
  SiGithub,
  SiHackerearth,
  SiLinkedin,
} from "react-icons/si";

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
  
  // Keep the real user name but ensure consistent UI structure
  const socialLinks = user.socialLinks || {};
  const entries = Object.entries(socialLinks).filter(
    ([, url]) => url && typeof url === 'string' && url.trim() !== ""
  );

  function normalizeLeetcodeURL(url) {
    const leetcodeRegex =
      /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/;
    if (!leetcodeRegex.test(url)) return null;
    return url.replace(/\/$/, "");
  }

  function normalizeGitHubURL(url) {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
    if (!githubRegex.test(url)) return null;
    return url.replace(/\/$/, "");
  }

  const leetcodeUrl = (url) => {
    const normalized = normalizeLeetcodeURL(url);
    if (!normalized) return "#";
    const username = normalized.split("/").pop();
    return `/leetcode/${username}`;
  };

  const githubUrl = (url) => {
    if (!url) return "#";
    const username = url.replace(/\/$/, "").split("/").pop();
    return `/dashboard/github/${username}`;
  };

  return (
    <CardWrapper>
      <div className="flex items-center flex-col gap-3">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] overflow-hidden">
          <img
          src={
            user.avatar
              ? user.avatar.startsWith("http")
                ? user.avatar
                : `${import.meta.env.VITE_API_URL}${user.avatar}`
              : `https://api.dicebear.com/6.x/micah/svg?seed=${user.name || 'fallback'}`
          }
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover"
        />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-[var(--primary)]">
            {user.name || 'User'}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)]">{user.email || ''}</p>
        </div>
      </div>

            <div className="mt-3">
        <p className="text-md font-medium text-[var(--primary)] mb-1">
          Platforms
        </p>
        <div className="flex flex-wrap gap-3">
          {/* Always show GitHub icon */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[var(--card-alt)] p-2 rounded-md hover:bg-[var(--secondary)] transition-colors"
          >
            <SiGithub className="text-[var(--primary)]" />
          </a>
        </div>
      </div>
    </CardWrapper>
  );
}
