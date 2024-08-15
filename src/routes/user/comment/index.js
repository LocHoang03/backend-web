const router = require('express').Router();
const CommentController = require('../../../controllers/user/comment/index');
const CheckToken = require('../../../middlewares/checkToken');

router.route('/').get(CheckToken, CommentController.getAllComment);
router.route('/add-comment').post(CheckToken, CommentController.postAddComment);
router
  .route('/delete-comment/:commentId')
  .post(CheckToken, CommentController.postDeleteComment);

router
  .route('/update-comment')
  .post(CheckToken, CommentController.postUpdateComment);

module.exports = router;
