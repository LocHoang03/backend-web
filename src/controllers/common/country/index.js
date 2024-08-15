const countries = require('../../../assets/country');

exports.getAllCountry = async (req, res, next) => {
  res.status(200).json({
    data: countries,
    success: true,
    message: `Get all country successfully.`,
  });
};
