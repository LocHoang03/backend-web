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
      new ErrorResponse(
        `The system is experiencing problems, please try again later!!`,
        401,
      ),
    );
  }
  res.status(201).json({
    success: true,
    data: question,
    message: 'Create question successfully',
  });
});

exports.postUpdateCommonQuestions = AsyncHandler(async (req, res, next) => {
  const question = await CommonQuestions.findById(req.params.questionId);
  if (!question) {
    return next(
      new ErrorResponse(
        `Cannot find question id ${req.params.questionId}!!`,
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
    message: `update question ${req.params.questionId} successfully`,
  });
});

exports.postDeleteCommonQuestions = AsyncHandler(async (req, res, next) => {
  if (!req.params.questionId) {
    return next(
      new ErrorResponse(`Please enter a valid id question delete`, 404),
    );
  }
  const question = await CommonQuestions.findOne({
    _id: req.params.questionId,
  });
  if (!question) {
    return next(
      new ErrorResponse(
        `Cannot find question id ${req.params.questionId}!!`,
        401,
      ),
    );
  }

  await CommonQuestions.deleteOne({ _id: req.params.questionId });
  res.status(201).json({
    success: true,
    message: `delete question ${req.params.questionId} successfully`,
  });
});
