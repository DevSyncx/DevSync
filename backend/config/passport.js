const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

// Only use Google Strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Initializing Google OAuth strategy...');
  console.log('Callback URL:', process.env.GOOGLE_CALLBACK_URL);

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('Google profile received:', profile);
        try {
          // Simplified to avoid MongoDB dependency
          const user = {
            id: profile.id,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            isEmailVerified: true
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
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email", "read:user", "public_repo"],
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("GitHub profile received:", profile.username);

          // Fetch additional GitHub data
          let githubData = {};
          try {
            const res = await fetch(`https://api.github.com/user/${profile.id}`, {
              headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${accessToken}`
              }
            });
            if (res.ok) githubData = await res.json();
          } catch (err) {
            console.error("Error fetching GitHub user data:", err);
          }

          // Upsert user in MongoDB
          const user = await User.findOneAndUpdate(
            { $or: [{ githubId: profile.id }, { email: profile.emails?.[0]?.value }] },
            {
              githubId: profile.id,
              githubUsername: profile.username,
              name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value,
              avatar: profile.photos?.[0]?.value || "/uploads/avatars/default-avatar.png",
              accessToken: accessToken,
              isEmailVerified: true,
              socialLinks: {
                ...(req.user?.socialLinks || {}),
                github: profile._json?.html_url || `https://github.com/${profile.username}`
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          // Attach GitHub API info (optional)
          user.platforms = [
            {
              name: 'GitHub',
              username: profile.username,
              url: profile._json?.html_url || `https://github.com/${profile.username}`,
              followers: githubData?.followers || 0,
              following: githubData?.following || 0,
              repos: githubData?.public_repos || 0
            }
          ];

          await user.save(); // save the platforms info

          return done(null, user);
        } catch (err) {
          console.error("Error in GitHub strategy:", err);
          return done(err, null);
        }
      }
    )
  );
}

// serialize + deserialize (improved to store full user object)
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id || user.githubId || user.googleId);
  // Store the whole user object instead of just the ID
  // This avoids needing to retrieve the user from the database on every request
  
  // Make sure we're preserving the access token
  if (user.accessToken) {
    console.log("Access token preserved in session");
  } else {
    console.log("WARNING: No access token available in user object during serialization");
  }
  
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("Deserializing user:", user.id || user.githubId || user.googleId);
  
  // Confirm access token availability during deserialization
  if (user.accessToken) {
    console.log("Access token available during deserialization");
  } else {
    console.log("WARNING: Access token missing during deserialization");
  }
  
  // Simply pass through the user object
  done(null, user);
});
