const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Configure GitHub strategy with placeholder values
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'PLACEHOLDER_CLIENT_ID',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'PLACEHOLDER_SECRET',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // In a real application, you would:
        // 1. Check if the user exists in your database
        // 2. If not, create a new user
        // 3. Return the user object

        // For now, we'll just use the profile data directly
        const user = {
          id: profile.id,
          name: profile.displayName || profile.username,
          email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@example.com`,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
          githubUsername: profile.username,
          provider: 'github',
        };

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialization and deserialization
// These functions are required for sessions, even though we'll be using JWT
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;