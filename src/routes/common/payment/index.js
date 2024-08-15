const router = require('express').Router();
const PaymentController = require('../../../controllers/common/payment');

router.route('/from-page').get(PaymentController.getAllOrderFromPage);
router.route('/fetch-look').get(PaymentController.getAllOrderFetchLook);
module.exports = router;
