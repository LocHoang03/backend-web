const router = require('express').Router();
const OrderController = require('../../../controllers/common/order');

router.route('/get-order/:userId').get(OrderController.getOrderFromUserId);

module.exports = router;
