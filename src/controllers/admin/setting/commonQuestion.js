const CommonQuestions = require('../../../models/commonQuestions');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.postCreateCommonQuestions = AsyncHandler(async (req, res, next) => {
  const question = await CommonQuestions.create({
    title: req.body.title,
    description: req.body.description,
    createAt: Date.now(),
  });
  if (!question) {
    return next(
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }
  res.status(201).json({
    success: true,
    data: question,
    message: 'Tạo câu hỏi thành công.',
  });
});

exports.postUpdateCommonQuestions = AsyncHandler(async (req, res, next) => {
  const question = await CommonQuestions.findById(req.params.questionId);
  if (!question) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy câu hỏi id ${req.params.questionId}!!`,
        401,
      ),
    );
  }
  question.title = req.body.title;
  question.description = req.body.description;
  await question.save();
  res.status(201).json({
    success: true,
    data: question,
    message: `Cập nhật câu hỏi ${req.params.questionId} thành công`,
  });
});

exports.postDeleteCommonQuestions = AsyncHandler(async (req, res, next) => {
  if (!req.params.questionId) {
    return next(new ErrorResponse(`Vui lòng nhập câu hỏi id xóa hợp lệ.`, 404));
  }
  const question = await CommonQuestions.findOne({
    _id: req.params.questionId,
  });
  if (!question) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy câu hỏi id ${req.params.questionId}!!`,
        401,
      ),
    );
  }

  await CommonQuestions.deleteOne({ _id: req.params.questionId });
  res.status(201).json({
    success: true,
    message: `Xóa câu hỏi ${req.params.questionId} thành công.`,
  });
});
