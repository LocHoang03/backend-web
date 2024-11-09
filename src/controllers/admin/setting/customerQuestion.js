const CustomerQuestions = require('../../../models/customerQuestions');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const transporter = require('../../../configs/nodeMailer.js');
const emailExplain = require('../../../configs/mailExplain.js');

exports.postCreateCustomerQuestions = AsyncHandler(async (req, res, next) => {
  const question = await CustomerQuestions.create({
    title: req.body.title,
    description: req.body.description,
    userId: req.body.userId,
    createAt: Date.now(),
  });
  if (!question) {
    return next(
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }
  res.status(201).json({
    success: true,
    message: 'Tạo câu hỏi thành công.',
  });
});

exports.postResolveCustomerQuestions = AsyncHandler(async (req, res, next) => {
  const question = await CustomerQuestions.findById(
    req.params.explainId,
  ).populate('userId');
  if (!question) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy câu hỏi của khách hàng với id ${req.params.explainId}!!`,
        401,
      ),
    );
  }
  transporter.sendMail({
    from: `Showhub ${process.env.EMAIL_USERNAME}`,
    to: question.userId.email,
    subject: `Yêu cầu giải quyết vấn đề: ${question.title}`,
    html: emailExplain(question.userId.email, req.body.explanation),
  });
  question.isHandle = true;
  question.answer = req.body.explanation;
  await question.save();
  res.status(201).json({
    success: true,
    message: 'Thành công.',
  });
});
