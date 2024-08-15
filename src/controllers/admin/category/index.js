const Category = require('../../../models/category');
const Movies = require('../../../models/movies');
const Series = require('../../../models/series');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const DeleteFile = require('../../../utils/deleteFile');
const csv = require('csvtojson');

exports.postCreateCategory = AsyncHandler(async (req, res, next) => {
  const category = await Category.create({
    name: req.body.name,
    createAt: Date.now(),
  });
  if (!category) {
    return next(
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    data: category,
    message: 'Create category successfully',
  });
});

exports.postDeleteCategory = AsyncHandler(async (req, res, next) => {
  if (!req.params.categoryId) {
    return next(
      new ErrorResponse(`Please enter a valid id category delete`, 404),
    );
  }
  const category = await Category.findOne({ _id: req.params.categoryId });
  if (!category) {
    return next(
      new ErrorResponse(
        `Cannot find category id ${req.params.categoryId}!!`,
        401,
      ),
    );
  }

  await Movies.updateMany(
    { listCategoryId: req.params.categoryId },
    { $pull: { listCategoryId: req.params.categoryId } },
  );
  await Series.updateMany(
    { listCategoryId: req.params.categoryId },
    { $pull: { listCategoryId: req.params.categoryId } },
  );

  await Category.deleteOne({ _id: req.params.categoryId });
  res.status(201).json({
    success: true,
    message: `delete category ${req.params.categoryId} successfully`,
  });
});
exports.postUpdateCategory = AsyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ErrorResponse(
        `Cannot find category id ${req.params.categoryId}!!`,
        401,
      ),
    );
  }
  category.name = req.body.name;
  await category.save();
  res.status(201).json({
    success: true,
    data: category,
    message: `update category ${req.params.categoryId} successfully`,
  });
});
