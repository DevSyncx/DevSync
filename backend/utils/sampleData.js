/**
 * Utility to create sample GitHub data for testing
 */

/**
 * Generate sample GitHub activity data for testing
 * @param {number} days - Number of days to generate data for
 * @returns {Array} - Array of sample activity data
 */
function generateSampleActivityData(days = 30) {
  console.log(`Generating ${days} days of sample activity data`);
  const today = new Date();
  const sampleData = [];
  
  // Pre-define specific days to have activity instead of random
  // This creates a more realistic pattern with occasional activity
  const activityDays = [0, 2, 5, 9, 12, 15, 19, 21, 25, 28]; // Days with activity
  
  for (let i = 0; i < days; i++) {
    // Only create data for specific days
    if (activityDays.includes(i)) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate 1-2 activities per day (random)
      const activityCount = Math.floor(Math.random() * 2) + 1;
      
      sampleData.push({
        date: dateStr,
        day: dateStr,
        value: activityCount,
        type: 'SampleCommitEvent',
        repo: 'sample/repository',
        details: `Sample commit activity (${activityCount} commits)`
      });
    }
  }
  
  return sampleData;
}

/**
 * Generate sample GitHub profile data
 * @param {string} username - GitHub username
 * @returns {Object} - Sample profile data
 */
function generateSampleProfile(username) {
  return {
    login: username,
    id: 12345,
    avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4',
    html_url: `https://github.com/${username}`,
    name: username,
    company: 'Sample Company',
    blog: 'https://example.com',
    location: 'Sample Location',
    email: null,
    bio: 'Sample GitHub profile for testing purposes',
    public_repos: 20,
    public_gists: 5,
    followers: 100,
    following: 50,
    created_at: '2011-01-25T18:44:36Z',
    updated_at: '2023-09-15T12:30:45Z'
  };
}

/**
 * Generate sample GitHub repository data
 * @param {string} username - GitHub username
 * @returns {Array} - Array of sample repository data
 */
function generateSampleRepositories(username) {
  const repoCount = 8;
  const repos = [];
  
  const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'HTML', 'CSS', 'Ruby', 'Go'];
  const topics = ['web', 'api', 'react', 'node', 'frontend', 'backend', 'fullstack', 'mobile', 'data', 'ml'];
  
  for (let i = 1; i <= repoCount; i++) {
    const language = languages[Math.floor(Math.random() * languages.length)];
    const starsCount = Math.floor(Math.random() * 1000);
    const forksCount = Math.floor(Math.random() * 100);
    
    // Generate random date within the last year
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));
    
    // Get 2-4 random topics
    const repoTopics = [];
    const topicCount = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < topicCount; j++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      if (!repoTopics.includes(topic)) {
        repoTopics.push(topic);
      }
    }
    
    repos.push({
      id: 100000 + i,
      name: `repo-${i}`,
      full_name: `${username}/repo-${i}`,
      html_url: `https://github.com/${username}/repo-${i}`,
      description: `Sample repository ${i} for testing purposes`,
      language,
      topics: repoTopics,
      stargazers_count: starsCount,
      forks_count: forksCount,
      updated_at: date.toISOString(),
      created_at: date.toISOString()
    });
  }
  
  return repos;
}

/**
 * Generate complete GitHub data package for testing
 * @param {string} username - GitHub username
 * @returns {Object} - Complete GitHub data object
 */
function generateGitHubData(username) {
  const activities = generateSampleActivityData(60);
  const profile = generateSampleProfile(username);
  const repositories = generateSampleRepositories(username);
  
  return {
    activities,
    githubProfile: profile,
    repositories
  };
}

module.exports = {
  generateSampleActivityData,
  generateSampleProfile,
  generateSampleRepositories,
  generateGitHubData
};