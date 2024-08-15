const router = require('express').Router();
const {
  getVerifyUserToken,
  postUpdateProfile,
  postChangePassword,
  postChangeAvatarProfile,
  postDeleteAvatarProfile,
} = require('../../../controllers/common/auth/index');
const CheckToken = require('../../../middlewares/checkToken');
const { upload } = require('../../../helpers/multer');

router.route('/verify-token').get(CheckToken, getVerifyUserToken);
router.route('/profile').patch(CheckToken, postUpdateProfile);
router.route('/change-password').patch(
  CheckToken,

  postChangePassword,
);
router
  .route('/change-avatar')
  .patch(CheckToken, upload, postChangeAvatarProfile);

router.route('/delete-avatar').patch(CheckToken, postDeleteAvatarProfile);

module.exports = router;
