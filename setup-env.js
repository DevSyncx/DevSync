// Simple GitHub OAuth setup script for DevSync
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create .env files with GitHub OAuth credentials
async function setupGitHubOAuth() {
  console.log('\n===== DevSync GitHub OAuth Setup =====\n');
  
  // Get GitHub OAuth credentials
  const githubClientId = await new Promise(resolve => {
    rl.question('Enter your GitHub Client ID: ', resolve);
  });
  
  const githubClientSecret = await new Promise(resolve => {
    rl.question('Enter your GitHub Client Secret: ', resolve);
  });
  
  // Create backend .env
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const backendEnvContent = `PORT=5000
FRONTEND_URL=http://localhost:5174
JWT_SECRET=devsync-secret-key
GITHUB_CLIENT_ID=${githubClientId}
GITHUB_CLIENT_SECRET=${githubClientSecret}
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
`;
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log(`\n✅ Backend .env created at: ${backendEnvPath}`);

  // Create frontend .env
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  const frontendEnvContent = `VITE_API_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:5174
`;
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log(`✅ Frontend .env created at: ${frontendEnvPath}`);

  console.log('\nSetup complete! You can now run:');
  console.log('1. cd backend && npm run dev');
  console.log('2. cd frontend && npm run dev');

  rl.close();
}

// Run the setup
setupGitHubOAuth().catch(err => {
  console.error('Error:', err);
  rl.close();
});