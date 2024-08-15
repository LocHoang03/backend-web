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
  createUser,
);

router.route('/update/:userId').post(
  CheckToken,
  [
    body('firstName', 'Please enter your first name at least 3 characters!!')
      .trim()
      .isLength({ min: 3 }),
    body('lastName', 'Please enter your last name at least 3 characters!!')
      .trim()
      .isLength({ min: 3 }),
    body('email', 'Please enter email in correct format!!').custom(
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
          throw new Error('Email is registered in the system!!');
        }
      },
    ),
    body('phoneNumber', 'Please enter your phone number!!').isMobilePhone(),
    body('phoneNumber', 'Please enter your phone number!!')
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
          throw new Error('Phone number has been registered!!');
        }
      }),
  ],
  updateUser,
);

module.exports = router;
