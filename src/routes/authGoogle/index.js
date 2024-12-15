const router = require('express').Router();
const passport = require('passport');
require('dotenv').config();

// localhost:4000/api/auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', (err, profile) => {
      req.profile = profile;
      if (!err) {
        next();
      }
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(`${process.env.URL_CLIENT}/login-success/${req.profile._id}`);
  },
);

module.exports = router;
