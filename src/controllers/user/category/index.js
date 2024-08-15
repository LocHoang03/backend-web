const Category = require('../../../models/category');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllCategory = async (req, res, next) => {
  const category = await Category.find().sort({ createAt: -1 });

  res.status(200).json({
    data: category,
    success: true,
    count: category.length,
    message: `Get all category successfully.`,
  });
};


