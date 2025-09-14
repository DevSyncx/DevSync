# GitHub OAuth Implementation for DevSync

This guide explains how to set up GitHub OAuth authentication for DevSync without using your own personal GitHub credentials.

## Setup Instructions

### 1. Run the Setup Script

For Windows (PowerShell):

```powershell
.\setup-github-oauth.ps1
```

For Linux/Mac (Bash):

```bash
chmod +x setup-github-oauth.sh
./setup-github-oauth.sh
```

### 2. Update Your Routes (Optional)

If you want to add the AuthCallback route to your frontend, you need to update your routes in the main.jsx file:

```jsx
// Add this route to your existing routes
<Route path="/auth-callback" element={<AuthCallback />} />
```

### 3. Understanding What's Implemented

#### Backend

- **Authentication Routes**: `/auth/github`, `/auth/github/callback`, `/auth/verify`
- **Passport Strategy**: GitHub OAuth 2.0
- **JWT Authentication**: Tokens generated after successful OAuth
- **Protected Routes**: Middleware for securing API endpoints

#### Frontend

- **GitHub Buttons**: Connected to backend OAuth endpoints
- **AuthContext**: React context for managing auth state
- **AuthCallback**: Component to handle OAuth redirects

## Testing Without Real Credentials

The implementation uses placeholder credentials by default. For testing:

1. The GitHub button will redirect to `http://localhost:5000/auth/github`
2. Without real GitHub credentials, this will fail (expected behavior)
3. To simulate a successful login flow, use this command:

```bash
# This simulates a successful GitHub auth callback
curl "http://localhost:5174/auth-callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwibmFtZSI6IlRlc3QgVXNlciIsInByb3ZpZGVyIjoiZ2l0aHViIiwiaWF0IjoxNjk0Njk1MjAwLCJleHAiOjE2OTUzMDAwMDB9.kYFQGMHAaQQRnEjaUvRdiEU8aBHiBBRfH2ZpnUVTQ5Q"
```

This JWT token contains:

```json
{
  "id": "12345",
  "email": "test@example.com",
  "name": "Test User",
  "provider": "github",
  "iat": 1694695200,
  "exp": 1695300000
}
```

## Using Real GitHub Credentials (Optional)

To use real GitHub credentials:

1. Create a GitHub OAuth app at https://github.com/settings/developers
2. Set Homepage URL to http://localhost:5174
3. Set Authorization callback URL to http://localhost:5000/auth/github/callback
4. Copy the Client ID and Client Secret to your .env file
5. Restart your backend server
