const router = require('express').Router();
const CountryController = require('../../../controllers/common/country');

router.route('/').get(CountryController.getAllCountry);

module.exports = router;
