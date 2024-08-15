const router = require('express').Router();
const MoviesController = require('../../../../controllers/admin/film/Movies/index');
const { upload } = require('../../../../helpers/multer');
const CheckToken = require('../../../../middlewares/checkToken');
const CheckRoles = require('../../../../middlewares/checkRoles');
const { uploadCsv } = require('../../../../middlewares/addFileCsv');

router
  .route('/create-movies')
  .post(CheckToken, upload, MoviesController.postCreateMovies);
router
  .route('/delete-movies/:moviesId')
  .post(CheckToken, MoviesController.postDeleteMovies);

router
  .route('/update-movies/:moviesId')
  .post(upload, MoviesController.postUpdateMovies);

router
  .route('/add-many-movies')
  .post(uploadCsv, MoviesController.postAddManyMovies);
router.route('/recover-movies').post(MoviesController.postRecoverMovies);

module.exports = router;
