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
  console.log("GitHub OAuth is configured with:");
  console.log("- Client ID:", process.env.GITHUB_CLIENT_ID.substring(0, 5) + "...");
  console.log("- Callback URL:", process.env.GITHUB_CALLBACK_URL);
  
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "/api/auth/github/callback",
        scope: ["user:email", "read:user", "public_repo", "read:org", "user:follow"],
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log("GitHub authentication callback received");
          console.log("Profile:", JSON.stringify({
            id: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos
          }, null, 2));
          
          // Save access token for API calls - make sure it's directly accessible
          profile.accessToken = accessToken;
          
          console.log("Received access token:", accessToken ? "Yes (token available)" : "No (token missing)");
          
          // For the PR implementation, we're just returning the profile information
          // No MongoDB interaction needed for implementing the GitHub authentication
          
          // Try to fetch additional GitHub profile data
          const fetchGithubData = async () => {
            try {
              // GitHub API - User endpoint
              const userResponse = await fetch(`https://api.github.com/user/${profile.id}`, {
                headers: { 
                  'Accept': 'application/vnd.github.v3+json',
                  'Authorization': `token ${accessToken}`
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log("GitHub user data:", userData);
                return userData;
              }
              return null;
            } catch (error) {
              console.error("Error fetching GitHub user data:", error);
              return null;
            }
          };
          
          // Try to get additional GitHub data
          let githubData = null;
          try {
            githubData = await fetchGithubData();
          } catch (error) {
            console.error("Error in GitHub data fetch:", error);
          }
          
          const user = {
            id: profile.id,
            githubId: profile.id,
            username: profile.username, // Save GitHub username for API calls
            name: profile.displayName || profile.username,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
            // Store the access token explicitly
            accessToken: accessToken,
            isEmailVerified: true, // GitHub email is already verified
            // Add GitHub-specific profile data
            platforms: [
              { 
                name: 'GitHub', 
                username: profile.username,
                url: profile._json?.html_url || `https://github.com/${profile.username}`,
                followers: githubData?.followers || 0,
                following: githubData?.following || 0,
                repos: githubData?.public_repos || 0
              }
            ],
            streak: 0,
            timeSpent: "0 minutes",
            notes: [],
            activity: [],
            goals: []
          };
          
          console.log("Created user object:", JSON.stringify(user, null, 2));
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
