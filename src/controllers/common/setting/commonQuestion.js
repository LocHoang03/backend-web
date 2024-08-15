const CommonQuestions = require('../../../models/commonQuestions');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllCommonQuestions = async (req, res, next) => {
  const question = await CommonQuestions.find();

  res.status(200).json({
    data: question,
    success: true,
    message: `Get all question successfully.`,
  });
};

exports.getAllCommonQuestionsFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const count = await CommonQuestions.find().sort({ createAt: -1 });
  const common = await CommonQuestions.find()
    .sort({ createAt: -1 })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: common,
    success: true,
    count: count.length,
    message: `Get all common question successfully.`,
  });
};
