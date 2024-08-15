const ErrorResponse = require('../utils/errorResponse');

const CheckRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User not allowed to access route`, 401));
    } else {
      next();
    }
  };
};

module.exports = CheckRoles;
