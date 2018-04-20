const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(
  // The strategy handles the specifics of a 3rd party. In this case Google.
  // The code for a strategy is specific to what the 3rd party needs and what it returns
    new GoogleStrategy(
    {
      clientID: keys.googleClientID, 
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    }, 
    async (accessToken, refreshToken, profile, done) => {
      // The done argument is a callback that tells the passport strategy that our internal process is finished (handoff)
      // It takes  two parameters: 
      //  1st parameter is an error object (specify null if there are no errors)
      //  2nd parameter is the result (in this case the user object)

      //Verify if the user has been pre-recorded in MongoDB (has logged in before)
      const existingUser = await User.findOne({googleId: profile.id})

      if (existingUser) {
        return done(null, existingUser);
      } 

      // First time login - create a new MongoDB record
      const user = await new User({googleId: profile.id}).save()
      done(null, user);
    }
  )
);