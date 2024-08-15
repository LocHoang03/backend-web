const router = require('express').Router();
const SummaryController = require('../../../controllers/admin/summary/index');
const CheckToken = require('../../../middlewares/checkToken');

router.route('/summary-register').get(SummaryController.getSummaryRegister);
router.route('/summary-purchases').get(SummaryController.getSummaryPurchases);
router
  .route('/register-purchases-current-year')
  .get(SummaryController.getCountRegisterAndPurchasesCurrentYearAndMonth);

router
  .route('/summary-total-each-package')
  .get(SummaryController.getSummaryTotalAmountEachPackage);
module.exports = router;
