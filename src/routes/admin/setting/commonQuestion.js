const router = require('express').Router();
const CommonQuestionController = require('../../../controllers/admin/setting/commonQuestion');

router
  .route('/create')
  .post(CommonQuestionController.postCreateCommonQuestions);

router
  .route('/update/:questionId')
  .patch(CommonQuestionController.postUpdateCommonQuestions);

router
  .route('/delete/:questionId')
  .post(CommonQuestionController.postDeleteCommonQuestions);

module.exports = router;
