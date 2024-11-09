const router = require('express').Router();
const {
  getAllUser,
  createUser,
  updateUser,
  getAllUserFromPage,
  getAllUserFetchLook,
} = require('../../../../controllers/admin/manage/user');
const CheckToken = require('../../../../middlewares/checkToken');
const { body } = require('express-validator');
const User = require('../../../../models/user');
const Subscriber = require('../../../../models/subscriber');

router.route('/').get(CheckToken, getAllUser);
router.route('/from-page').get(getAllUserFromPage);
router.route('/fetch-look').get(getAllUserFetchLook);
router.route('/create').post(
  CheckToken,
  [
    body('firstName', 'Vui lòng nhập tên của bạn ít nhất 1 ký tự!!')
      .trim()
      .isLength({ min: 1 }),
    body('lastName', 'Vui lòng nhập họ của bạn ít nhất 1 ký tự!!')
      .trim()
      .isLength({ min: 1 }),
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
  createUser,
);

router.route('/update/:userId').post(
  CheckToken,
  [
    body('firstName', 'Vui lòng nhập tên của bạn với ít nhất 1 ký tự!!')
      .trim()
      .isLength({ min: 1 }),
    body('lastName', 'Vui lòng nhập họ của bạn với ít nhất 1 ký tự!!')
      .trim()
      .isLength({ min: 1 }),
    body('email', 'Vui lòng nhập email đúng định dạng!!').custom(
      async (value, { req }) => {
        const user = await User.findOne({
          email: value,
          _id: { $ne: req.params.userId },
        });
        const subscriber = await Subscriber.findOne({
          email: value,
          _id: { $ne: req.params.userId },
        });
        if (user || subscriber) {
          throw new Error('Email đã được đăng ký trong hệ thống!!');
        }
      },
    ),

    body('phoneNumber', 'Vui lòng nhập số điện thoại của bạn!!')
      .isMobilePhone()
      .custom(async (value, { req }) => {
        const user = await User.findOne({
          phoneNumber: value,
          _id: { $ne: req.params.userId },
        });
        const subscriber = await Subscriber.findOne({
          phoneNumber: value,
          _id: { $ne: req.params.userId },
        });
        if (user || subscriber) {
          throw new Error('Số điện thoại đã được đăng ký!!');
        }
      }),
  ],
  updateUser,
);

module.exports = router;
