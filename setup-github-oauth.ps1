# GitHub OAuth Setup Script for DevSync

# Navigate to backend directory
Set-Location -Path .\backend

# Install required packages
Write-Host "Installing required packages..."
npm install passport passport-github2 express-session jsonwebtoken cors cookie-parser --save

# Create .env file with placeholder values if it doesn't exist
if (!(Test-Path .env)) {
    Write-Host "Creating .env file with placeholder values..."
    @"
PORT=5000
GITHUB_CLIENT_ID=PLACEHOLDER_CLIENT_ID
GITHUB_CLIENT_SECRET=PLACEHOLDER_SECRET
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
JWT_SECRET=your_random_secret_string
FRONTEND_URL=http://localhost:5174
"@ | Out-File -FilePath .env -Encoding utf8
    
    Write-Host ".env file created with placeholder values."
    Write-Host "Please update GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET with real values when needed."
} else {
    Write-Host ".env file already exists. Skipping creation."
}

# Final instructions
Write-Host ""
Write-Host "===== Setup Complete ====="
Write-Host "To start using GitHub authentication:"
Write-Host "1. Create a GitHub OAuth app at https://github.com/settings/developers"
Write-Host "2. Set Homepage URL to http://localhost:5174"
Write-Host "3. Set Authorization callback URL to http://localhost:5000/auth/github/callback"
Write-Host "4. Copy the Client ID and Client Secret to your .env file"
Write-Host "5. Start the backend server with: npm run dev"
Write-Host "6. Start the frontend with: cd ../frontend; npm run dev"
Write-Host ""
Write-Host "Note: The current implementation uses placeholder values and will not connect to GitHub"
Write-Host "until you update the .env file with actual GitHub OAuth credentials."