const Order = require('../../../models/order');
const Subscriber = require('../../../models/subscriber');
const Package = require('../../../models/package');
const AsyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

exports.getAllOrderFromPage = AsyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let count, order;
  count = await Order.find({
    isDelete: false,
  }).sort({
    createAt: -1,
  });
  order = await Order.find({
    isDelete: false,
  })
    .populate('userId')
    .populate('packageId')
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      _id: order[i]._id,
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      email: order[i].userId.email,
      typePack: order[i].packageId.typePack,
      monthlyPrice: order[i].packageId.monthlyPrice,
      userId: order[i].userId,
      packageId: order[i].packageId,
      createAt: order[i].createAt,
      expirationDate: order[i].expirationDate,
    };
    data.push(obj);
  }

  res.status(200).json({
    data: data,
    success: true,
    count: count.length,
    message: `Get all order successfully.`,
  });
});

exports.getAllOrderFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const package = req.query.package;
  let count, order;
  const subscriber = await Subscriber.find(
    {
      firstName: { $regex: `.*${firstName}.*`, $options: 'i' },
      lastName: { $regex: `.*${lastName}.*`, $options: 'i' },
    },
    '_id',
  );

  const subscribers = subscriber.map((sub) => sub._id);
  if (package === 'All') {
    count = await Order.find({
      userId: { $in: subscribers },
      isDelete: false,
    }).sort({ createAt: -1 });
    order = await Order.find({
      userId: { $in: subscribers },
      isDelete: false,
    })
      .populate('userId')
      .populate('packageId')
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await Order.find({
      userId: { $in: subscribers },
      packageId: package,
      isDelete: false,
    }).sort({ createAt: -1 });
    order = await Order.find({
      userId: { $in: subscribers },
      packageId: package,
      isDelete: false,
    })
      .populate('userId')
      .populate('packageId')
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      _id: order[i]._id,
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      email: order[i].userId.email,
      typePack: order[i].packageId.typePack,
      monthlyPrice: order[i].packageId.monthlyPrice,
      userId: order[i].userId,
      packageId: order[i].packageId,
      createAt: order[i].createAt,
      expirationDate: order[i].expirationDate,
    };
    data.push(obj);
  }

  res.status(200).json({
    data: data,
    success: true,
    count: count.length,
    message: `Get all order successfully.`,
  });
};

exports.postAddPayment = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user.userId);
  if (!user) {
    return next(new ErrorResponse('User not found!!', 401));
  }

  let order;
  if (req.query.login) {
    await Order.deleteOne({ userId: req.body.userId });
    order = await Order.create({
      userId: req.body.userId,
      information: req.body.dataPayment,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  } else {
    order = await Order.create({
      userId: req.body.userId,
      information: req.body.dataPayment,
      createAt: Date.now(),
      expirationDate: Date.now() + 60 * 60 * 24 * 30 * 1000,
    });
  }

  return res.status(201).json({
    order: order,
    success: true,
    message: `Tạo đơn hàng thanh toán thành công.`,
    version: 1.0,
  });
});
