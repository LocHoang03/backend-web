const router = require('express').Router();
const PaymentController = require('../../../controllers/admin/order');

router.route('/create-payment').post(PaymentController.postAddPayment);

module.exports = router;
