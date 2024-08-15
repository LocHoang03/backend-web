const Package = require('../../../models/package');
const AsyncHandler = require('express-async-handler');

exports.getPackage = AsyncHandler(async (req, res, next) => {
  const paymentData = await Package.find().sort({ monthlyPrice: -1 });
  res.status(200).json({
    data: paymentData,
    success: true,
    count: paymentData.length,
    message: `Get all data package successfully.`,
  });
});

exports.getPackageMax = AsyncHandler(async (req, res, next) => {
  const paymentData = await Package.find().sort({ monthlyPrice: -1 }).limit(1);
  res.status(200).json({
    packageId: paymentData[0]._id,
    success: true,
    message: `Get data package max successfully.`,
  });
});

exports.getAllPackageFromPage = AsyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let count, package;
  count = await Package.find({
    // isDelete: false,
  }).sort({
    createAt: -1,
  });
  package = await Package.find({
    // isDelete: false,
  })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: package,
    success: true,
    count: count.length,
    message: `Get all package successfully.`,
  });
});

exports.getAllPackageFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const name = req.query.name;
  let count, package;

  count = await Package.find({
    typePack: { $regex: `.*${name}.*`, $options: 'i' },
  }).sort({ createAt: -1 });
  package = await Package.find({
    typePack: { $regex: `.*${name}.*`, $options: 'i' },
  })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: package,
    success: true,
    count: count.length,
    message: `Get all package successfully.`,
  });
};
