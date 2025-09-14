# GitHub OAuth Implementation

## Step 1: Install necessary packages
Run this command in the backend directory:

```bash
npm install passport passport-github2 express-session jsonwebtoken cors cookie-parser
```

## Step 2: Create a .env file with PLACEHOLDER values
Create a file named `.env` in the backend directory with these PLACEHOLDER values:

```
PORT=5000
GITHUB_CLIENT_ID=PLACEHOLDER_CLIENT_ID
GITHUB_CLIENT_SECRET=PLACEHOLDER_SECRET
GITHUB_CALLBACK_URL=http://localhost:5000/auth/github/callback
JWT_SECRET=your_random_secret_string
FRONTEND_URL=http://localhost:5174
```

> **Note**: Replace the placeholder values with actual GitHub OAuth credentials when you're ready to test with a real GitHub account.

## Step 3: Create directory structure
Create these folders in your backend directory:
- middleware
- routes
- config
- utils