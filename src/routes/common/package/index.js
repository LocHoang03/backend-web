const router = require('express').Router();
const PackageController = require('../../../controllers/common/package');

router.route('/').get(PackageController.getPackage);
router.route('/package-max').get(PackageController.getPackageMax);
router.route('/from-page').get(PackageController.getAllPackageFromPage);
router.route('/fetch-look').get(PackageController.getAllPackageFetchLook);
module.exports = router;
