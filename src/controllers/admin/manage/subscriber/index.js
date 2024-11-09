const Subscriber = require('../../../../models/subscriber');
const Order = require('../../../../models/order');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllSubscriber = AsyncHandler(async (req, res, next) => {
  let subscriber;
  if (req.query.banned === 'false') {
    subscriber = await Subscriber.find({ isBanned: false }).sort({
      createAt: -1,
    });
  } else {
    subscriber = await Subscriber.find({ isBanned: true }).sort({
      createAt: -1,
    });
  }

  res.status(200).json({
    success: true,
    data: subscriber,
    count: subscriber.length,
    message: 'Get all subscriber successfully.',
  });
});

exports.getAllSubscriberFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const banned = req.query.banned || false;
  let count, subscriber;
  if (banned === 'false') {
    count = await Subscriber.find({ isBanned: false }).sort({ createAt: -1 });
    subscriber = await Subscriber.find({ isBanned: false })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await Subscriber.find({ isBanned: true }).sort({ createAt: -1 });
    subscriber = await Subscriber.find({ isBanned: true })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  res.status(200).json({
    data: subscriber,
    success: true,
    count: count.length,
    message: `Get all subscriber successfully.`,
  });
};

exports.getAllSubscriberFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const firstName = req.query.firstName || '';
  const lastName = req.query.lastName || '';
  const email = req.query.email !== 'All' ? req.query.email : null;
  const gender = req.query.gender !== 'All' ? req.query.gender : null;
  const banned = req.query.banned === 'true' ? true : false;

  let query = {
    firstName: { $regex: `.*${firstName}.*`, $options: 'i' },
    lastName: { $regex: `.*${lastName}.*`, $options: 'i' },
    isBanned: banned,
  };

  if (banned) {
    query.isBanned = banned;
  }

  if (email) {
    query.email = email;
  }

  if (gender) {
    query.sex = gender;
  }

  const [count, subscriber] = await Promise.all([
    Subscriber.countDocuments(query),
    Subscriber.find(query)
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);
  res.status(200).json({
    data: subscriber,
    success: true,
    count: count,
    message: 'Get all subscriber successfully.',
  });
};

exports.getSubscriberTop5 = AsyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.find({}).sort({ createAt: -1 }).limit(5);

  res.status(200).json({
    success: true,
    data: subscriber,
    message: 'get all subscriber to day successfully',
  });
});

exports.getSubscriberOrderTop5 = AsyncHandler(async (req, res, next) => {
  const order = await Order.find({})
    .populate('userId')
    .populate('packageId')
    .sort({ createAt: -1 })
    .limit(5);
  let data = [];
  for (let i = 0; i < order.length; i++) {
    const obj = {
      firstName: order[i].userId.firstName,
      lastName: order[i].userId.lastName,
      typePack: order[i].packageId.typePack,
      monthlyPrice: order[i].packageId.monthlyPrice,
    };
    data.push(obj);
  }
  res.status(200).json({
    success: true,
    data: data,
    message: 'get all order today successfully',
  });
});

exports.postBannedSubscriber = AsyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.findById(req.body.userId);

  if (!subscriber) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy người đăng ký id ${req.body.userId}!!`,
        401,
      ),
    );
  }
  subscriber.isBanned = true;
  await subscriber.save();
  res.status(200).json({
    success: true,
    message: 'Đã thay đổi trạng thái bị cấm thành công.',
  });
});

exports.postRecoverSubscriber = AsyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.findById(req.body.userId);

  if (!subscriber) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy người đăng ký id ${req.body.userId}!!`,
        401,
      ),
    );
  }
  subscriber.isBanned = false;
  await subscriber.save();
  res.status(200).json({
    success: true,
    message: 'Đã thay đổi trạng thái bị cấm thành công.',
  });
});
