# GitHub OAuth Implementation Guide

This document explains how to properly set up GitHub OAuth authentication in the DevSync project.

## Prerequisites

1. A GitHub account with access to create OAuth Apps
2. Node.js and npm installed
3. The DevSync project cloned to your local machine

## Setup Steps

### 1. Create a GitHub OAuth App

1. Go to GitHub Settings > Developer Settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: DevSync
   - Homepage URL: http://localhost:5174
   - Authorization callback URL: http://localhost:5000/auth/github/callback
4. Register the application
5. Note the Client ID and generate a Client Secret

### 2. Configure Environment Variables

1. In the `backend` folder, create a `.env` file based on `.env-example`
2. Add your GitHub Client ID and Secret:

   ```
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   JWT_SECRET=your_random_secret_string
   FRONTEND_URL=http://localhost:5174
   ```

3. In the `frontend` folder, create a `.env` file:
   ```
   VITE_API_URL=http://localhost:5000
   ```

### 3. Install Dependencies

In both the `frontend` and `backend` folders, run:

```
npm install
```

### 4. Start the Application

1. Start the backend:

   ```
   cd backend
   npm run dev
   ```

2. Start the frontend:
   ```
   cd frontend
   npm run dev
   ```

## Testing the Authentication Flow

1. Navigate to http://localhost:5174/login
2. Click the GitHub button
3. Authorize the application in GitHub
4. You should be redirected back to the app and logged in

## Troubleshooting

- Check the console for any error messages
- Verify that your Client ID and Secret are correct
- Make sure the backend server is running on port 5000
- Make sure the frontend server is running on port 5174
- Verify that the callback URL in GitHub settings matches your server config
