# 🗂 Environment Variables Guide

**Purpose:**  
This file lists all the environment variables required for the project.  
For detailed setup instructions, refer to the linked setup guides below.

---

```bash
# -----------------------------
# Application Settings
# -----------------------------

# Port on which the application runs locally
PORT=5000

# URL of the frontend client
CLIENT_URL=http://localhost:5173

# -----------------------------
# Database Settings
# -----------------------------

# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# -----------------------------
# Authentication & Security
# -----------------------------

# Secret key for signing JSON Web Tokens
JWT_SECRET=<your-jwt-secret>

# Secret key for session cookies
SESSION_SECRET=<your-session-secret>

# -----------------------------
# Google OAuth Settings
# -----------------------------

# Google OAuth client ID
GOOGLE_CLIENT_ID=<your-google-client-id>           # See [Google OAuth Setup](./google-auth-setup.md) for detailed instructions

# Google OAuth client secret
GOOGLE_CLIENT_SECRET=<your-google-client-secret>   # See [Google OAuth Setup](./google-auth-setup.md)

# Callback URL for Google OAuth redirects
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/callback   # See [Google OAuth Setup](./google-auth-setup.md)

# -----------------------------
# Admin & Notifications
# -----------------------------

# Email of the admin account
ADMIN_EMAIL=your-registered-email@example.com    # Must match the email used for services like Resend

# -----------------------------
# Email Service (Resend) Settings
# -----------------------------

# API key for sending emails via Resend
RESEND_API_KEY=<your-resend-api-key>             # Must have full access permissions; see [Resend Setup](./resend-setup.md)

```

## ⚠️ Notes

- **Do not commit `.env` files** to Git. Always add `.env` to `.gitignore`.  
- Ensure `ADMIN_EMAIL` matches the registered email for services like Resend.  
- After setting environment variables, test **Google OAuth login** and **email functionality**.  
- For detailed setup instructions, follow the guides below:  
  - [Google OAuth Setup](./setup/google_auth_setup.md)  
  - [Resend API Setup](./setup/resend_setup.md)


