const router = require('express').Router();
const CheckToken = require('../../../middlewares/checkToken');
const {
  postAddPaymentUser,
  postPackageOrder,
  getAllOrder,
  getAllOrderUser,
  getOrderFromUserId,
} = require('../../../controllers/user/order/index');

router.route('/').get(CheckToken, getAllOrder);
router.route('/:userId').get(CheckToken, getOrderFromUserId);
router.route('/post-package-order').post(CheckToken, postPackageOrder);
router.route('/subscription-package').post(CheckToken, postAddPaymentUser);

module.exports = router;
