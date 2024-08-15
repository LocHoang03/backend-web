const CustomerQuestions = require('../../../models/customerQuestions');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllCustomerQuestionsFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const count = await CustomerQuestions.find({ isHandle: false }).sort({
    createAt: -1,
  });
  const customer = await CustomerQuestions.find({ isHandle: false })
    .populate('userId')
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  let data = [];
  for (let i = 0; i < customer.length; i++) {
    data.push({
      _id: customer[i]._id,
      title: customer[i].title,
      description: customer[i].description,
      isHandle: customer[i].isHandle,
      createAt: customer[i].createAt,
      firstName: customer[i].userId.firstName,
      lastName: customer[i].userId.lastName,
      email: customer[i].userId.email,
      phoneNumber: customer[i].userId.phoneNumber,
      userId: customer[i].userId,
    });
  }

  res.status(200).json({
    data: data,
    success: true,
    count: count.length,
    message: `Get all customer question successfully.`,
  });
};
