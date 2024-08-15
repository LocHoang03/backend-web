const router = require('express').Router();
const CheckToken = require('../../../middlewares/checkToken');
const {
  getPayment,
  postPayment,
} = require('../../../controllers/user/payment/index');

router.route('/').get(getPayment);
router.route('/create-payment-intent').post(postPayment);

module.exports = router;
