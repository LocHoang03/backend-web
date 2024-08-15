const router = require('express').Router();
const PackageController = require('../../../controllers/admin/package');

router.route('/create-package').get(PackageController.postCreatePackage);
router
  .route('/update-package/:packageId')
  .post(PackageController.postUpdatePackage);
// router.route('/create').get(PackageController.postCreate);

module.exports = router;
