const AsyncHandler = require('express-async-handler');
const Order = require('../../../models/order');
const Subscriber = require('../../../models/subscriber');
const ErrorResponse = require('../../../utils/errorResponse');
const createOrderPdf = require('../../../utils/orderPdf');
const transporter = require('../../../configs/nodeMailer.js');
require('dotenv').config();

exports.getAllOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.find({ isDelete: false })
    .populate('packageId')
    .sort({ createAt: -1 });
  return res.status(200).json({
    data: order,
    success: true,
    message: `Get all order successfully.`,
    version: 1.0,
  });
});

exports.getOrderFromUserId = AsyncHandler(async (req, res, next) => {
  const order = await Order.find({ isDelete: false, userId: req.params.userId })
    .populate('packageId')
    .sort({ createAt: -1 })
    .limit(1);

  return res.status(200).json({
    data: order[0],
    success: true,
    message: `Get all order successfully.`,
    version: 1.0,
  });
});

exports.postPackageOrder = AsyncHandler(async (req, res, next) => {
  const order = await Order.findOne({
    userId: req.body.userId,
    expirationDate: { $gt: Date.now() },
  })
    .sort({ createAt: -1 })
    .limit(1)
    .populate('packageId');

  if (!order) {
    return res.status(200).json({
      success: false,
      version: 1.0,
    });
  }

  return res.status(200).json({
    success: true,
    data: order,
    message: `Find order payment id ${req.body.userId} successfully.`,
    version: 1.0,
  });
});

exports.postAddPaymentUser = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user.userId);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }
  let order;
  if (req.query.login) {
    await Order.updateMany({ userId: req.body.userId }, { isDelete: true });
    order = await Order.create({
      userId: req.body.userId,
      packageId: req.body.packageId,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  } else {
    order = await Order.create({
      userId: req.body.userId,
      packageId: req.body.packageId,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  }

  const orderPdf = await Order.findById(order._id)
    .populate('userId')
    .populate('packageId');

  if (orderPdf) {
    const pdfPath = await createOrderPdf(orderPdf);

    res.status(201).json({
      success: true,
      message: `Create order payment id ${req.user._id} successfully.`,
      version: 1.0,
    });
    // Gửi email với tệp PDF đính kèm
    return transporter.sendMail({
      from: `Showhub ${process.env.EMAIL_USERNAME}`,
      to: orderPdf.userId.email,
      subject: 'Invoice purchase',
      attachments: [
        {
          filename: 'invoice.pdf',
          path: pdfPath,
          contentType: 'application/pdf',
        },
      ],
    });
  }
});
