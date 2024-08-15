const router = require('express').Router();
const CommonQuestionController = require('../../../controllers/common/setting/commonQuestion');

router.route('/').get(CommonQuestionController.getAllCommonQuestions);

router
  .route('/from-page')
  .get(CommonQuestionController.getAllCommonQuestionsFromPage);

module.exports = router;
