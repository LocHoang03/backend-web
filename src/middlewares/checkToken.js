const Subscriber = require('../models/subscriber');
const ErrorResponse = require('../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const CheckToken = AsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorResponse(`not authorized to access this route`, 401));
  }

  try {
    const certKey = fs.readFileSync(path.join(__dirname, '../../server.cert'));
    const decoded = jwt.verify(token, certKey);
    req.user = decoded.userInfo;
    next();
  } catch (error) {
    next(new ErrorResponse(`not authorized to access this route`, 401));
  }
});
module.exports = CheckToken;
