const router = require('express').Router();
const CategoryController = require('../../../controllers/common/category/index');

router.route('/').get(CategoryController.getAllCategory);
router.route('/from-page').get(CategoryController.getAllCategoryFromPage);
router.route('/fetch-look').get(CategoryController.getAllCategoryFetchLook);
module.exports = router;
