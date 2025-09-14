#!/bin/bash

# GitHub OAuth Setup Script for DevSync

# Navigate to backend directory
cd backend

# Install required packages
echo "Installing required packages..."
npm install passport passport-github2 express-session jsonwebtoken cors cookie-parser --save

# Create .env file with placeholder values if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file with placeholder values..."
  cat > .env << EOL
PORT=5000
GITHUB_CLIENT_ID=PLACEHOLDER_CLIENT_ID
GITHUB_CLIENT_SECRET=PLACEHOLDER_SECRET
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
JWT_SECRET=your_random_secret_string
FRONTEND_URL=http://localhost:5174
EOL
  echo ".env file created with placeholder values."
  echo "Please update GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET with real values when needed."
else
  echo ".env file already exists. Skipping creation."
fi

# Final instructions
echo ""
echo "===== Setup Complete ====="
echo "To start using GitHub authentication:"
echo "1. Create a GitHub OAuth app at https://github.com/settings/developers"
echo "2. Set Homepage URL to http://localhost:5174"
echo "3. Set Authorization callback URL to http://localhost:5000/auth/github/callback"
echo "4. Copy the Client ID and Client Secret to your .env file"
echo "5. Start the backend server with: npm run dev"
echo "6. Start the frontend with: cd ../frontend && npm run dev"
echo ""
echo "Note: The current implementation uses placeholder values and will not connect to GitHub"
echo "until you update the .env file with actual GitHub OAuth credentials."