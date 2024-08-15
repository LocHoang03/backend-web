const router = require('express').Router({ mergeParams: true });
const {
  getAllFilmForSeries,
  postCreateFilmForSeries,
  postUpdateFilmForSeries,
  postCheckSeriesNumber,
  postDeleteFilmForSeries,
  postRecoverFilmForSeries,
} = require('../../../../controllers/admin/film/filmForSeries/index');
const { upload } = require('../../../../helpers/multer');

router.route('/').get(getAllFilmForSeries);
router.route('/create-film').post(upload, postCreateFilmForSeries);
router.route('/update-film/:filmId').post(upload, postUpdateFilmForSeries);
router.route('/delete-film/:filmId').post(postDeleteFilmForSeries);
router.route('/check-series-number').post(postCheckSeriesNumber);
router.route('/recover-film').post(postRecoverFilmForSeries);

module.exports = router;
