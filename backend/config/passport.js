const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

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
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          console.log('Creating new user from Google profile');
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
          });
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/auth/github/callback",
        scope: ["read:user", "user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = null;
          if (Array.isArray(profile.emails) && profile.emails.length > 0) {
            email = profile.emails.find(e => e.verified)?.value || profile.emails[0].value;
          }

          let user = await User.findOne({ githubId: profile.id });
          if (!user && email) {
            // Optional linking by email if previously registered
            user = await User.findOne({ email });
            if (user && !user.githubId) {
              user.githubId = profile.id;
              if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
              await user.save();
            }
          }

          if (!user) {
            user = new User({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email: email,
              avatar: profile.photos?.[0]?.value,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// serialize + deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
