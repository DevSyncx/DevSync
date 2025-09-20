const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Only use Google Strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Simplified to avoid MongoDB dependency
          const user = {
            id: profile.id,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          };
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// GitHub OAuth Strategy - Only use if credentials are provided
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  console.log("GitHub OAuth is configured with:");
  console.log("- Client ID:", process.env.GITHUB_CLIENT_ID.substring(0, 5) + "...");
  console.log("- Callback URL:", process.env.GITHUB_CALLBACK_URL);
  
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // For the PR implementation, we're just returning the profile information
          // No MongoDB interaction needed for implementing the GitHub authentication
          const user = {
            id: profile.id,
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
            isEmailVerified: true, // GitHub email is already verified
          };
          
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// serialize + deserialize (simplified to avoid MongoDB dependency)
passport.serializeUser((user, done) => {
  done(null, user.id || user.githubId || user.googleId);
});

passport.deserializeUser((id, done) => {
  // Simply pass through the ID without MongoDB lookup
  done(null, { id });
});
