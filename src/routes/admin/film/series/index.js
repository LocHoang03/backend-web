const router = require('express').Router();
const SeriesController = require('../../../../controllers/admin/film/Series/index');
const {
  postAddManyFilmForSeries,
} = require('../../../../controllers/admin/film/filmForSeries/index');
const FilmForSeriesRouter = require('../filmForSeries/index');
const { upload } = require('../../../../helpers/multer');
const { uploadCsv } = require('../../../../middlewares/addFileCsv');

router.use('/:seriesId', FilmForSeriesRouter);

router.route('/create-series').post(upload, SeriesController.postCreateSeries);
router
  .route('/delete-series/:seriesId')
  .post(SeriesController.postDeleteSeries);

router
  .route('/update-series/:seriesId')
  .patch(upload, SeriesController.postUpdateSeries);

router.route('/recover-series').post(SeriesController.postRecoverSeries);
router
  .route('/create-many-series')
  .post(uploadCsv, SeriesController.postAddManyMovies);

router
  .route('/create-many-film-for-series')
  .post(uploadCsv, postAddManyFilmForSeries);

module.exports = router;
