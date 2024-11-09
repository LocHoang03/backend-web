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
    body('firstName', 'Vui lòng nhập tên của bạn với ít nhất 3 ký tự!!')
      .trim()
      .isLength({ min: 3 }),
    body('lastName', 'Vui lòng nhập họ của bạn với ít nhất 3 ký tự!!')
      .trim()
      .isLength({ min: 3 }),
    body('email', 'Vui lòng nhập email đúng định dạng!!').custom(
      async (value, { req }) => {
        const user = await User.findOne({ email: value });
        const subscriber = await Subscriber.findOne({ email: value });
        if (user || subscriber) {
          throw new Error('Email đã được đăng ký trong hệ thống!!');
        }
      },
    ),
    body('phoneNumber', 'Vui lòng nhập số điện thoại của bạn!!')
      .isMobilePhone()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ phoneNumber: value });
        const subscriber = await Subscriber.findOne({ phoneNumber: value });
        if (user || subscriber) {
          throw new Error('Số điện thoại đã được đăng ký!!');
        }
      }),
  ],
  postSignup,
);

router
  .route('/login')
  .post([body('email', 'Vui lòng nhập email đúng định dạng!!')], postLogin);

router.route('/login-authentication').post(postLoginAuthentication);

router
  .route('/forgot-password')
  .post(
    [body('email', 'Vui lòng nhập email đúng định dạng!!').isEmail()],
    postForgotPassword,
  );

router.route('/verify-token-reset-password').post(postVerifyToken);

router.route('/reset-password').post(
  [
    body('confirmNewPassword').custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error(
          'Xác nhận mật khẩu mới phải khớp với mật khẩu mới của bạn!!',
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
