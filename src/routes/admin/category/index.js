const router = require('express').Router();
const CategoryController = require('../../../controllers/admin/category/index');
const { uploadCsv } = require('../../../middlewares/addFileCsv');

router.route('/create-category').post(CategoryController.postCreateCategory);
router
  .route('/update-category/:categoryId')
  .patch(CategoryController.postUpdateCategory);
router
  .route('/delete-category/:categoryId')
  .post(CategoryController.postDeleteCategory);

module.exports = router;
