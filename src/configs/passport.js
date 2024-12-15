var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/user');
const Subscriber = require('../models/subscriber');
const transporter = require('../configs/nodeMailer.js');
const emailSignupGoogleTemplate = require('../configs/mailSignupWithGoogle.js');
const generator = require('generate-password');
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.URL_BACKEND}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      let newUser, user, subscriber;
      try {
        user = await User.findOne({ email: profile.emails[0].value });
        subscriber = await Subscriber.findOne({
          email: profile.emails[0].value,
        });
        if (!user && !subscriber) {
          const password = generator.generate({
            length: 8,
            numbers: true,
            symbols: true,
            lowercase: true,
            uppercase: true,
          });

          const hashPassword = await bcrypt.hash(password, 12);
          newUser = await Subscriber.create({
            firstName: profile?.name?.givenName || ' ',
            lastName: profile?.name?.familyName || ' ',
            email: profile.emails[0].value,
            password: hashPassword,
            createAt: Date.now(),
          });
          transporter.sendMail({
            from: `Showhub ${process.env.EMAIL_USERNAME}`,
            to: profile.emails[0].value,
            subject: 'Đăng ký tài khoản Showhub của bạn',
            html: emailSignupGoogleTemplate(
              profile.name.givenName + profile.name.familyName,
              password,
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
