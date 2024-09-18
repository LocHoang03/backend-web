var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/user');
const Subscriber = require('../models/subscriber');
const transporter = require('../configs/nodeMailer.js');
const emailSignupGoogleTemplate = require('../configs/mailSignupWithGoogle.js');

require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4000/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      let newUser, user, subscriber;
      try {
        user = await User.findOne({ email: profile.emails[0].value });
        subscriber = await Subscriber.findOne({
          email: profile.emails[0].value,
        });
        if (!user && !subscriber) {
          newUser = await Subscriber.create({
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            createAt: Date.now(),
          });
          console.log(newUser);
          transporter.sendMail({
            from: `Showhub ${process.env.EMAIL_USERNAME}`,
            to: profile.emails[0].value,
            subject: 'Registration of your Showhub account',
            html: emailSignupGoogleTemplate(
              profile.name.givenName + profile.name.familyName,
            ),
          });
        }
      } catch (error) {
        console.log(error);
      }
      if (newUser) return cb(null, newUser);
      else if (user) return cb(null, user);
      else if (subscriber) return cb(null, subscriber);
    },
  ),
);
