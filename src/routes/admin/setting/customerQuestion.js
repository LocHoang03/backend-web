const router = require('express').Router();
const CustomerQuestionController = require('../../../controllers/admin/setting/customerQuestion');

router
  .route('/create')
  .post(CustomerQuestionController.postCreateCustomerQuestions);

router
  .route('/resolve-question/:explainId')
  .post(CustomerQuestionController.postResolveCustomerQuestions);

module.exports = router;
