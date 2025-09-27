/**
 * GitHub synchronization utilities to pull user data from GitHub API
 */
const fetch = require('node-fetch');

/**
 * Fetch GitHub user activity data and profile information
 * @param {string} username - GitHub username
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<Object>} - Object containing activity data and user profile
 */
async function getGitHubActivity(username, accessToken) {
  try {
    console.log(`Fetching GitHub activity for user: ${username}`);
    console.log(`Access token available: ${!!accessToken}`);
    
    // Build headers
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    // Only add Authorization header if we have a token
    if (accessToken) {
      // GitHub API accepts both "token" and "Bearer" formats, but Bearer is more standard for OAuth 2.0
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log("Using Bearer token for GitHub API requests");
    } else {
      console.log("No token available for GitHub API requests");
    }
    
    // Fetch user profile from GitHub
    const profileData = await fetchGitHubProfile(username, accessToken);
    console.log("Fetched GitHub profile:", profileData ? "success" : "failed");
    
    // GitHub Events API - Get user events with detailed debug logging
    console.log(`Fetching events for user: ${username}`);
    console.log(`API URL: https://api.github.com/users/${username}/events`);
    console.log(`Headers: ${JSON.stringify(headers, (key, value) => 
      key === 'Authorization' ? 'Bearer [TOKEN HIDDEN]' : value)}`);
      
    const response = await fetch(`https://api.github.com/users/${username}/events`, {
      headers: headers
    });

    if (!response.ok) {
      console.error(`GitHub Events API error: ${response.status} ${response.statusText}`);
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events = await response.json();
    console.log(`Fetched ${events.length} events from GitHub`);
    
    // Also get user's repositories
    const repositories = await fetchUserRepositories(username, accessToken);
    console.log(`Fetched ${repositories.length} repositories from GitHub`);
    
    // Also get contributions data using the GraphQL API for better heatmap visualization
    console.log("Attempting to fetch contribution data...");
    let contributionData = [];
    if (accessToken) {
      contributionData = await fetchContributionCalendar(accessToken);
      console.log(`Fetched ${contributionData.length} contribution data points`);
    } else {
      console.log("Skipping contribution calendar fetch - no token available");
    }
    
    // Transform GitHub events into activity entries
    console.log("Processing GitHub events into activity entries");
    const eventActivities = events.slice(0, 30).map(event => {
      const date = new Date(event.created_at);
      return {
        date: date.toISOString().split('T')[0], // YYYY-MM-DD
        day: date.toISOString().split('T')[0], // Format for heatmap
        value: 1, // Base value for heatmap
        type: event.type,
        repo: event.repo?.name || "unknown",
        details: getEventDetails(event)
      };
    });
    
    console.log(`Processed ${eventActivities.length} event activities`);
    
    // Combine event activities with contribution data
    const allActivities = [...eventActivities, ...contributionData];
    console.log(`Total activities to process: ${allActivities.length}`);
    
    // Group by date to prevent duplicates and limit to most recent 60 days
    const activityMap = new Map();
    
    // Get cutoff date (60 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 60);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    console.log(`Filtering activities to only show from ${cutoffDateStr} onwards`);
    
    allActivities.forEach(activity => {
      const day = activity.date || activity.day;
      if (!day) return;
      
      // Only include activities from the last 60 days
      if (day >= cutoffDateStr) {
        if (activityMap.has(day)) {
          // Increment count for existing day
          const existingActivity = activityMap.get(day);
          existingActivity.value = (existingActivity.value || 0) + (activity.value || 1);
        } else {
          // Create new entry
          activityMap.set(day, {
            ...activity,
            day: day,
            date: day,
            value: activity.value || 1
          });
        }
      }
    });
    
    console.log(`Grouped activities by date: ${activityMap.size} unique days (after filtering)`);
    
    // Create the result array
    const result = Array.from(activityMap.values());
    
    // Create a proper return object instead of attaching properties to the array
    // This will fix the "activity is not iterable" issue
    return {
      activities: result,
      githubProfile: profileData,
      repositories: repositories
    };
    
    return activityData;
  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    return [];
  }
}

/**
 * Fetch GitHub user profile information
 * @param {string} username - GitHub username
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<Object>} - GitHub user profile data
 */
async function fetchGitHubProfile(username, accessToken) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log(`Adding Bearer token to GitHub profile request for ${username}`);
    }
    
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: headers
    });
    
    if (!response.ok) {
      console.error(`Error fetching GitHub profile: ${response.status}`);
      return {};
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return {};
  }
}

/**
 * Fetch user's GitHub repositories
 * @param {string} username - GitHub username
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<Array>} - Array of repository data
 */
async function fetchUserRepositories(username, accessToken) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log(`Adding Bearer token to repository request for ${username}`);
    }
    
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`, {
      headers: headers
    });
    
    if (!response.ok) {
      console.error(`Error fetching GitHub repositories: ${response.status}`);
      return [];
    }
    
    const repos = await response.json();
    
    // Transform repo data to include only what we need
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      updated_at: repo.updated_at
    }));
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
}

/**
 * Fetch contribution calendar data using GitHub GraphQL API
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<Array>} - Array of contribution data
 */
async function fetchContributionCalendar(accessToken) {
  try {
    console.log("Attempting to fetch contribution calendar via GraphQL API");
    // GraphQL query to fetch contribution calendar
    const query = `
      query {
        viewer {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;
    
    console.log("GraphQL Query:", query);
    console.log("GraphQL API URL: https://api.github.com/graphql");
    console.log("Using Authorization header with Bearer token");
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      console.warn(`GitHub GraphQL API error: ${response.status}`);
      // If GraphQL API fails, fall back to the REST API for commit stats
      return await fetchCommitActivity(accessToken);
    }
    
    const result = await response.json();
    
    // Check for GraphQL errors
    if (result.errors) {
      console.warn('GitHub GraphQL API returned errors:', result.errors);
      // Fall back to REST API
      return await fetchCommitActivity(accessToken);
    }
    
    // Extract contribution data
    const calendar = result.data?.viewer?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      console.warn('No calendar data in GraphQL response');
      return await fetchCommitActivity(accessToken);
    }
    
    // Flatten the weeks array and map to the format we need
    const contributionDays = [];
    calendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        contributionDays.push({
          day: day.date, // YYYY-MM-DD
          date: day.date,
          value: day.contributionCount
        });
      });
    });
    
    return contributionDays;
  } catch (error) {
    console.error('Error fetching contribution calendar:', error);
    // Fall back to REST API
    return await fetchCommitActivity(accessToken);
  }
}

/**
 * Fallback function to fetch commit activity using REST API
 * @param {string} accessToken - GitHub OAuth access token
 * @returns {Promise<Array>} - Array of activity data
 */
async function fetchCommitActivity(accessToken) {
  try {
    // Get authenticated user to get username
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${accessToken}`
    };
    
    const userResponse = await fetch('https://api.github.com/user', {
      headers
    });
    
    if (!userResponse.ok) {
      console.error('Error fetching user data:', userResponse.status);
      return [];
    }
    
    const userData = await userResponse.json();
    const username = userData.login;
    
    // Get user's repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers
    });
    
    if (!reposResponse.ok) {
      console.error('Error fetching repositories:', reposResponse.status);
      return [];
    }
    
    const repos = await reposResponse.json();
    
    // Create a map to store commit counts by date
    const commitsByDate = {};
    
    // For each repo, get commit activity
    const commitPromises = repos.slice(0, 10).map(async (repo) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${username}&per_page=100`,
          { headers }
        );
        
        if (!commitsResponse.ok) return [];
        
        const commits = await commitsResponse.json();
        
        // Process commits
        commits.forEach(commit => {
          const date = new Date(commit.commit.committer.date)
            .toISOString().split('T')[0];
          
          if (!commitsByDate[date]) {
            commitsByDate[date] = 0;
          }
          
          commitsByDate[date]++;
        });
      } catch (error) {
        console.error(`Error fetching commits for ${repo.full_name}:`, error);
      }
    });
    
    // Wait for all commit fetching to complete
    await Promise.all(commitPromises);
    
    // Convert to array format
    return Object.entries(commitsByDate).map(([date, count]) => ({
      day: date,
      date,
      value: count
    }));
  } catch (error) {
    console.error('Error in fetchCommitActivity:', error);
    return [];
  }
}

/**
 * Extract meaningful details from different GitHub event types
 */
function getEventDetails(event) {
  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${event.payload.commits?.length || 0} commit(s)`;
    case 'PullRequestEvent':
      return `${event.payload.action} pull request #${event.payload.number}`;
    case 'IssuesEvent':
      return `${event.payload.action} issue #${event.payload.issue?.number}`;
    case 'CreateEvent':
      return `Created ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'DeleteEvent':
      return `Deleted ${event.payload.ref_type} ${event.payload.ref || ''}`;
    case 'WatchEvent':
      return 'Starred a repository';
    case 'ForkEvent':
      return 'Forked a repository';
    default:
      return event.type;
  }
}

/**
 * Calculate GitHub streak from activity data
 * @param {Array} activity - GitHub activity data
 * @returns {number} - Current streak count
 */
function calculateStreak(activity) {
  if (!activity || activity.length === 0) return 0;
  
  console.log(`Calculating streak from ${activity.length} activities`);
  
  // Sort activity by date
  const sortedActivity = [...activity].sort((a, b) => {
    const dateA = a.date || a.day;
    const dateB = b.date || b.day;
    return new Date(dateB) - new Date(dateA);
  });
  
  // Group by date (to count only one contribution per day)
  const uniqueDays = new Set();
  sortedActivity.forEach(item => {
    const date = item.date || item.day;
    if (date) uniqueDays.add(date);
  });
  const days = Array.from(uniqueDays);
  console.log(`Found ${days.length} unique days with activity`);
  
  // Calculate streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStr = today.toISOString().split('T')[0];
  
  // Check if there's activity today
  const hasTodayActivity = days.includes(todayStr);
  
  // If no activity today, start checking from yesterday
  let currentDate = new Date(today);
  if (!hasTodayActivity) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (days.includes(dateStr)) {
      currentStreak++;
    } else {
      break;
    }
    
    // Move to the previous day
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return currentStreak;
}

module.exports = {
  getGitHubActivity,
  calculateStreak,
  fetchGitHubProfile,
  fetchUserRepositories
};