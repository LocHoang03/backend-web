const router = require('express').Router();
const CustomerQuestionController = require('../../../controllers/common/setting/customerQuestion');

router
  .route('/from-page')
  .get(CustomerQuestionController.getAllCustomerQuestionsFromPage);

module.exports = router;
