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
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }
  res.status(201).json({
    success: true,
    data: category,
    message: 'Tạo danh mục thành công.',
  });
});

exports.postDeleteCategory = AsyncHandler(async (req, res, next) => {
  if (!req.params.categoryId) {
    return next(
      new ErrorResponse(`Vui lòng nhập danh mục id xóa hợp lệ!!`, 404),
    );
  }
  const category = await Category.findOne({ _id: req.params.categoryId });
  if (!category) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy danh mục id ${req.params.categoryId}!!`,
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
    message: `Xóa danh mục ${req.params.categoryId} thành công`,
  });
});
exports.postUpdateCategory = AsyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy danh mục id ${req.params.categoryId}!!`,
        401,
      ),
    );
  }
  category.name = req.body.name;
  await category.save();
  res.status(201).json({
    success: true,
    data: category,
    message: `Cập nhật danh mục ${req.params.categoryId} thành công`,
  });
});
