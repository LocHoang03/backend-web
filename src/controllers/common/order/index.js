const Order = require('../../../models/order');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getOrderFromUserId = AsyncHandler(async (req, res, next) => {
  const order = await Order.find({
    userId: req.params.userId,
    isDelete: false,
  }).populate({
    path: 'packageId',
  });
  res.status(200).json({
    data: order,
    success: true,
    message: `Get order from userId ${req.params.userId} successfully.`,
  });
});
