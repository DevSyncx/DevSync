import { User, RefreshCw, Github, Check } from "lucide-react";
import React, { useEffect, useMemo } from "react";
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

// Normalize LeetCode URL to standard format
const normalizeLeetcodeURL = (url) => {
  if (!url) return '';
  // Handle both old and new LeetCode URL formats
  const leetcodeURLPattern = /leetcode\.com\/([^\/]+)/;
  const match = url.match(leetcodeURLPattern);
  return match ? `https://leetcode.com/${match[1]}` : url;
};

export default function ProfileCard({ user, onSyncGithub, syncingGithub = false }) {
  if (!user) return null; // don't render until user is loaded
  
  const githubPlatform = user.platforms?.find(p => p.name === 'GitHub');
  const hasGithubPlatform = !!githubPlatform;
  const hasGithubActivity = Array.isArray(user.activity) && user.activity.length > 0;
  
  // Debug logged when user or activity changes
  useEffect(() => {
    console.log("ProfileCard received user:", user);
    console.log("Has GitHub platform:", hasGithubPlatform);
    console.log("Has GitHub activity:", hasGithubActivity);
  }, [user, hasGithubPlatform, hasGithubActivity]);

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
          
          {/* GitHub Status */}
          {hasGithubPlatform && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm">
              <Github size={16} className="text-[var(--muted-foreground)]" />
              <span className="text-[var(--muted-foreground)]">
                {githubPlatform.username || 'GitHub Connected'}
              </span>
              {hasGithubActivity && (
                <span className="flex items-center text-green-600">
                  <Check size={14} className="mr-1" /> Synced
                </span>
              )}
            </div>
          )}
          
          {/* GitHub Sync Button removed - authentication only */}
        </div>
      </div>

      {/* Platforms */}
      <div className="mt-3">
        <p className="text-md font-medium text-[var(--primary)] mb-1">Platforms</p>
        {useMemo(() => {
          const platforms = user.platforms || [];
          const entries = platforms.map(p => [p.name, p.url]);
          
          return entries.length > 0 ? (
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
        );
        }, [user.platforms])}
      </div>
    </CardWrapper>
  );
}
