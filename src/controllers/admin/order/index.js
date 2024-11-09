const AsyncHandler = require('express-async-handler');
const Order = require('../../../models/order');
const Subscriber = require('../../../models/subscriber');
const ErrorResponse = require('../../../utils/errorResponse');

exports.postAddPayment = AsyncHandler(async (req, res, next) => {
  await Order.updateMany({ userId: req.body.userId }, { isDelete: true });
  const order = await Order.create({
    userId: req.body.userId,
    packageId: req.body.packageId,
    createAt: Date.now(),
    expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
  });

  const orderData = await Order.findOne({
    userId: req.body.userId,
    isDelete: false,
  })
    .populate('userId')
    .populate('packageId');

  const obj = {
    firstName: orderData.userId.firstName,
    _id: orderData._id,
    firstName: orderData.userId.firstName,
    lastName: orderData.userId.lastName,
    email: orderData.userId.email,
    typePack: orderData.packageId.typePack,
    monthlyPrice: orderData.packageId.monthlyPrice,
    userId: orderData.userId,
    packageId: orderData.packageId,
    createAt: orderData.createAt,
    expirationDate: orderData.expirationDate,
  };
  return res.status(201).json({
    data: obj,
    success: true,
    message: `Tạo đơn hàng thanh toán thành công.`,
    version: 1.0,
  });
});
