const User = require('../../../models/user.js');
const Subscriber = require('../../../models/subscriber.js');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse.js');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const hashToken = require('../../../helpers/signJwtTokenUser.js');
const emailTemplate = require('../../../configs/mailText.js');
const emailSignupTemplate = require('../../../configs/mailSignupText.js');
const emailLogin = require('../../../configs/mailLogin.js');
const transporter = require('../../../configs/nodeMailer.js');
const crypto = require('crypto');
const util = require('util');
const generator = require('generate-password');
const passwordValidator = require('password-validator');
require('dotenv').config();

exports.postLogin = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 401));
  }
  const user = await Subscriber.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse('Thông tin tài khoản hoặc mật khẩu không đúng!!', 401),
    );
  }
  const hashPassword = await bcrypt.compare(req.body.password, user.password);

  if (!hashPassword) {
    return next(
      new ErrorResponse('Thông tin tài khoản hoặc mật khẩu không đúng!!', 401),
    );
  }
  const userInfo = {
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUser: user.avatarUser,
    phoneNumber: user.phoneNumber,
    role: user.role,
    sex: user.sex,
  };
  const token = await hashToken(userInfo);

  if (user.isBanned) {
    res.status(200).json({
      success: true,
      isBanned: true,
      version: 1.0,
    });
  } else {
    const code = Math.floor(100000 + Math.random() * 900000);
    user.twoFactor.auth = false;
    user.twoFactor.code = code;
    user.twoFactor.time = Date.now() + 1800000;
    user.twoFactor.resend = Date.now();
    await user.save();
    transporter.sendMail({
      from: `Showhub ${process.env.EMAIL_USERNAME}`,
      to: req.body.email,
      subject: 'Yêu cầu xác thực đăng nhập cho tài khoản Showhub của bạn.',
      html: emailLogin(`${user.firstName} ${user.lastName}`, code),
    });
    res.status(200).json({
      success: true,
      isBanned: false,
      token: token,
      version: 1.0,
    });
  }
});

exports.postLoginAuthentication = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findOne({ _id: req.body.userId });

  if (!user) {
    return next(new ErrorResponse('Tài khoản này không được tìm thấy!!', 401));
  }

  const userInfo = {
    userId: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUser: user.avatarUser,
    phoneNumber: user.phoneNumber,
    sex: user.sex,
  };
  const token = await hashToken(userInfo);

  if (user.isBanned) {
    res.status(200).json({
      success: true,
      isBanned: true,
      version: 1.0,
    });
  } else {
    const code = Math.floor(100000 + Math.random() * 900000);
    user.twoFactor.auth = false;
    user.twoFactor.code = code;
    user.twoFactor.time = Date.now() + 1800000;
    user.twoFactor.resend = Date.now();
    await user.save();
    transporter.sendMail({
      from: `Showhub ${process.env.EMAIL_USERNAME}`,
      to: user.email,
      subject: 'Yêu cầu xác thực đăng nhập cho tài khoản Showhub của bạn.',
      html: emailLogin(`${user.firstName} ${user.lastName}`, code),
    });
    res.status(200).json({
      success: true,
      isBanned: false,
      token: token,
      version: 1.0,
    });
  }
});

exports.postRequestCode = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findOne({
    email: req.body.email,
    isBanned: false,
    'twoFactor.resend': { $lt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Không đủ thời gian để yêu cầu lại!!', 401));
  }

  const code = Math.floor(100000 + Math.random() * 900000);
  user.twoFactor.auth = false;
  user.twoFactor.code = code;
  user.twoFactor.time = Date.now() + 1800000;
  user.twoFactor.resend = Date.now() + 60000;
  await user.save();
  transporter.sendMail({
    from: `Showhub ${process.env.EMAIL_USERNAME}`,
    to: req.body.email,
    subject: 'Yêu cầu xác thực đăng nhập cho tài khoản Showhub của bạn.',
    html: emailLogin(`${user.firstName} ${user.lastName}`, code),
  });

  res.status(200).json({
    success: true,
    version: 1.0,
  });
});

exports.postSignup = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }

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
    const newUser = await Subscriber.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      sex: req.body.sex,
      password: hashPassword,
      createAt: Date.now(),
    });

    if (newUser) {
      try {
        transporter.sendMail({
          from: `Showhub ${process.env.EMAIL_USERNAME}`,
          to: req.body.email,
          subject: 'Yêu cầu đăng ký tài khoản Showhub của bạn',
          html: emailSignupTemplate(
            req.body.firstName + req.body.lastName,
            password,
          ),
        });
        return res.status(200).json({
          user: newUser,
          success: true,
          message: 'Tạo tài khoản thành công.',
          version: 1.0,
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

exports.postForgotPassword = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }
  const user = await Subscriber.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('Email đăng ký không tồn tại!!', 401));
  }
  const randomBytes = util.promisify(crypto.randomBytes);
  const buf = await randomBytes(32);
  const token = buf.toString('hex');
  user.resetToken = token;
  user.tokenExpiration = Date.now() + 900000;
  await user.save();
  try {
    transporter.sendMail({
      from: `Showhub ${process.env.EMAIL_USERNAME}`,
      to: req.body.email,
      subject: 'Yêu cầu đặt lại mật khẩu Showhub của bạn',
      html: emailTemplate(user.firstName + user.lastName, token),
    });
    return res.status(200).json({
      success: true,
      message: 'Yêu cầu tạo mật khẩu thành công.',
      version: 1.0,
    });
  } catch (error) {
    return next(new ErrorResponse('Đã xảy ra lỗi khi gửi email.', 500));
  }
});

exports.postNewPassword = AsyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    return next(new ErrorResponse(message, 401));
  }

  const schema = new passwordValidator();

  schema
    .is()
    .min(8)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits(1)
    .has()
    .symbols(1)
    .has()
    .not()
    .spaces();

  if (!schema.validate(req.body.newPassword)) {
    return next(
      new ErrorResponse(
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.',
        401,
      ),
    );
  }

  const user = await Subscriber.findOne({
    resetToken: req.body.token,
    tokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Mã xác nhận đã hết hạn!!', 401));
  }

  const hashPassword = await bcrypt.hash(req.body.newPassword, 12);

  if (!hashPassword) {
    return next(
      new ErrorResponse('Server đang gặp sự cố, vui lòng thử lại sau!!', 401),
    );
  }

  user.password = hashPassword;
  user.resetToken = undefined;
  await user.save();
  return res.status(201).json({
    success: true,
    message: 'Đổi mật khẩu mới thành công.',
    version: 1.0,
  });
});

exports.postVerifyToken = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findOne({
    token: req.body.resetToken,
    tokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Mã xác nhận đã hết hạn!!', 401));
  } else {
    return res.status(200).json({
      success: true,
      message: 'Xác minh thành công.',
      isAuth: user.twoFactor.auth,
      version: 1.0,
    });
  }
});

exports.postLogout = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findById(req.user.userId);
  if (!user) {
    return next(new ErrorResponse('Người dùng không tồn tại!!', 401));
  } else {
    user.twoFactor.auth = false;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công.',
      version: 1.0,
    });
  }
});

exports.postVerifyLogin = AsyncHandler(async (req, res, next) => {
  const user = await Subscriber.findOne({
    _id: req.user.userId,
    'twoFactor.code': req.body.code,
    'twoFactor.time': { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Người dùng không tồn tại!!!!', 401));
  } else {
    user.twoFactor.auth = true;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Xác nhận đăng nhập thành công.',
      version: 1.0,
    });
  }
});
