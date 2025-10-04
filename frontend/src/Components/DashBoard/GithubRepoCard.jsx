import React from 'react';
import { Github, Star, GitFork, Clock } from 'lucide-react';
import CardWrapper from './CardWrapper';

/**
 * Component to display a list of GitHub repositories
 */
export default function GithubRepoCard({ repositories = [], className = '' }) {
  // Format the update time to a readable string
  const formatUpdateTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  };

  // Language color mapping
  const languageColors = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Rust: '#dea584',
    Dart: '#00B4AB',
    // Add more languages as needed
    default: '#cccccc'
  };

  return (
    <CardWrapper className={`p-4 overflow-y-auto max-h-80 ${className}`}>
      <div className="flex items-center mb-4">
        <Github size={20} className="text-[var(--primary)] mr-2" />
        <h3 className="text-lg font-semibold text-[var(--primary)]">
          Repositories
        </h3>
      </div>

      {repositories.length === 0 ? (
        <p className="text-sm text-[var(--muted-foreground)] italic text-center py-4">
          No repositories found. Connect with GitHub to see your repositories.
        </p>
      ) : (
        <div className="space-y-3">
          {repositories.map((repo) => (
            <div key={repo.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
              <a 
                href={repo.html_url} 
                target="_blank"
                rel="noopener noreferrer" 
                className="font-medium text-blue-600 hover:underline"
              >
                {repo.name}
              </a>
              
              {repo.description && (
                <p className="text-sm text-[var(--muted-foreground)] mt-1 line-clamp-2">
                  {repo.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-[var(--muted-foreground)]">
                {repo.language && (
                  <div className="flex items-center">
                    <span 
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: languageColors[repo.language] || languageColors.default }}
                    ></span>
                    {repo.language}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Star size={12} className="mr-1" />
                  {repo.stargazers_count}
                </div>
                
                <div className="flex items-center">
                  <GitFork size={12} className="mr-1" />
                  {repo.forks_count}
                </div>
                
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {formatUpdateTime(repo.updated_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardWrapper>
  );
}