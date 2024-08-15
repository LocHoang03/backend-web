exports.errorHandler = (err, req, res, next) => {
  let error = {};
  error.message = err.message;
  error.statusCode = err.statusCode;

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server error',
  });
};
