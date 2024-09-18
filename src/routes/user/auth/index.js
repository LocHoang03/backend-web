const router = require('express').Router();
const {
  postSignup,
  postLogin,
  postForgotPassword,
  postNewPassword,
  postVerifyToken,
  postLogout,
  postVerifyLogin,
  postRequestCode,
  postLoginAuthentication,
} = require('../../../controllers/user/auth/index');
const { body } = require('express-validator');
const User = require('../../../models/user');
const Subscriber = require('../../../models/subscriber');
const CheckToken = require('../../../middlewares/checkToken');

router.route('/signup').post(
  [
    body('firstName', 'Please enter your first name at least 3 characters!!')
      .trim()
      .isLength({ min: 3 }),
    body('lastName', 'Please enter your last name at least 3 characters!!')
      .trim()
      .isLength({ min: 3 }),
    body('email', 'Please enter email in correct format!!').custom(
      async (value, { req }) => {
        const user = await User.findOne({ email: value });
        const subscriber = await Subscriber.findOne({ email: value });
        if (user || subscriber) {
          throw new Error('Email is registered in the system!!');
        }
      },
    ),
    body('phoneNumber', 'Please enter your phone number!!')
      .isMobilePhone()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ phoneNumber: value });
        const subscriber = await Subscriber.findOne({ phoneNumber: value });
        if (user || subscriber) {
          throw new Error('Phone number has been registered!!');
        }
      }),
  ],
  postSignup,
);

router
  .route('/login')
  .post([body('email', 'Please enter email in correct format!!')], postLogin);

router.route('/login-authentication').post(postLoginAuthentication);

router
  .route('/forgot-password')
  .post(
    [body('email', 'Please enter email in correct format!!').isEmail()],
    postForgotPassword,
  );

router.route('/verify-token-reset-password').post(postVerifyToken);

router.route('/reset-password').post(
  [
    body('confirmNewPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error(
          'Confirm new password has to match with you new password!!',
        );
      }
      return true;
    }),
  ],
  postNewPassword,
);

router.route('/logout').post(CheckToken, postLogout);
router.route('/verify-login').post(CheckToken, postVerifyLogin);
router.route('/resend-code').post(CheckToken, postRequestCode);

module.exports = router;
