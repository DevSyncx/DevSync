import { User } from "lucide-react";
import React from "react";
import CardWrapper from "./CardWrapper";
import {
  SiLeetcode, SiCodechef, SiHackerrank, SiGithub, SiHackerearth, SiLinkedin,
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
  if (!user) return null; // don't render until user is loaded
  const socialLinks = user.socialLinks || {};
  const entries = Object.entries(socialLinks);

  function normalizeLeetcodeURL(url) {
    const leetcodeRegex = /^https?:\/\/(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/;
    if (!leetcodeRegex.test(url)) {
      return null;
    }
    return url.replace(/\/$/, '');
  }

  return (
    <CardWrapper>
      {/* Header */}
      <div className="flex items-center flex-col gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <User size={28} />
          )}
        </div>

        {/* Name + Email */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[var(--primary)]">{user.name}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
        </div>
      </div>

      {/* Platforms */}
      <div className="mt-3">
        <p className="text-md font-medium text-[var(--primary)] mb-1">Platforms</p>
        {entries.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {entries.map(([platformName, url]) => {
              const Icon = iconMap[platformName.toLowerCase()];
              if (!Icon) return null;
              const leetcodeUrl = (url) => {
                url = normalizeLeetcodeURL(url);
                const username = url.split("/").pop();
                return `/leetcode/${username}`

              }
              return (
                <a
                  key={platformName}
                  href={platformName == 'leetcode' ? leetcodeUrl(url) : url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-[var(--secondary)]  shadow-sm hover:shadow-md transition"
                  title={platformName}
                >
                  <Icon className="w-5 h-5 text-[var(--primary)]" />
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)] italic">
            No platforms linked yet
          </p>
        )}
      </div>
    </CardWrapper>
  );
}
