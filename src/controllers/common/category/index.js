const Category = require('../../../models/category');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllCategory = async (req, res, next) => {
  const category = await Category.find().sort({ createAt: -1 });

  res.status(200).json({
    data: category,
    success: true,
    message: `Get all category successfully.`,
  });
};

exports.getAllCategoryFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const count = await Category.find().sort({ createAt: -1 });
  const category = await Category.find()
    .sort({ createAt: -1 })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: category,
    success: true,
    count: count.length,
    message: `Get all category successfully.`,
  });
};

exports.getAllCategoryFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const name = req.query.name;
  let count, category;
  count = await Category.find({
    name: { $regex: `.*${name}.*`, $options: 'i' },
  }).sort({ createAt: -1 });
  category = await Category.find({
    name: { $regex: `.*${name}.*`, $options: 'i' },
  })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: category,
    success: true,
    count: count.length,
    message: `Get all series successfully.`,
  });
};
