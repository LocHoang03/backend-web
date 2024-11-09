const ErrorResponse = require('../utils/errorResponse');

const CheckRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`Người dùng không được phép truy cập!!`, 401),
      );
    } else {
      next();
    }
  };
};

module.exports = CheckRoles;
