const User = require('../../../../models/user');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const emailSignupTemplate = require('../../../../configs/mailSignupText.js');
const transporter = require('../../../../configs/nodeMailer.js');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const { validationResult } = require('express-validator');
require('dotenv').config();

exports.getAllUser = AsyncHandler(async (req, res, next) => {
  const user = await User.find({ role: { $ne: 'superAdmin' } }).sort({
    createAt: -1,
  });
  res.status(200).json({
    success: true,
    data: user,
    count: user.length,
    message: 'get all user successfully',
  });
});

exports.getAllUserFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  let count, user;
  count = await User.find({ role: { $ne: 'superAdmin' } }).sort({
    createAt: -1,
  });
  user = await User.find({ role: { $ne: 'superAdmin' } })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    data: user,
    success: true,
    count: count.length,
    message: `Get all user successfully.`,
  });
};

exports.getAllUserFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const firstName = req.query.firstName || '';
  const lastName = req.query.lastName || '';
  const email = req.query.email !== 'All' ? req.query.email : null;
  const gender = req.query.gender !== 'All' ? req.query.gender : null;

  let query = {
    role: { $ne: 'superAdmin' },
    firstName: { $regex: `.*${firstName}.*`, $options: 'i' },
    lastName: { $regex: `.*${lastName}.*`, $options: 'i' },
  };

  if (email) {
    query.email = email;
  }

  if (gender) {
    query.sex = gender;
  }

  const [count, user] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);
  res.status(200).json({
    data: user,
    success: true,
    count: count,
    message: 'Get all user successfully.',
  });
};

exports.createUser = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }
  // const user = await User.find({ role: 'admin' });
  const password = generator.generate({
    length: 8,
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
  });
  const hashPassword = await bcrypt.hash(password, 12);
  if (!hashPassword) {
    return next(
      new ErrorResponse('Server đang gặp sự cố, vui lòng thử lại sau!!', 401),
    );
  } else {
    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      sex: req.body.sex,
      password: hashPassword,
      role: req.body.typeAccount,
      createAt: Date.now(),
    });

    if (newUser) {
      try {
        res.status(200).json({
          user: newUser,
          success: true,
          message: 'Tạo tài khoản thành công.',
          version: 1.0,
        });
        return transporter.sendMail({
          from: `Showhub ${process.env.EMAIL_USERNAME}`,
          to: req.body.email,
          subject: 'Yêu cầu đăng ký tài khoản Showhub của bạn',
          html: emailSignupTemplate(
            `${req.body.firstName} ${req.body.lastName}`,
            password,
          ),
        });
      } catch (error) {
        return next(new ErrorResponse('Đã xảy ra lỗi khi gửi email.', 500));
      }
    } else {
      return next(
        new ErrorResponse('Server đang gặp sự cố, vui lòng thử lại sau!!', 401),
      );
    }
  }
});

exports.updateUser = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }

  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy người dùng id ${req.params.userId}!!`,
        401,
      ),
    );
  }

  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.phoneNumber = req.body.phoneNumber;
  user.sex = req.body.sex;
  user.role = req.body.typeAccount;
  await user.save();

  res.status(201).json({
    data: user,
    success: true,
    message: `Cập nhật người dùng ${req.params.userId} thành công.`,
    version: 1.0,
  });
});
