const router = require('express').Router({ mergeParams: true });
const {
  getAllFilmForSeries,
  getAllFilmForSeriesPage,
  getFilmForSeriesFromNumber,
} = require('../../../../controllers/common/film/filmForSeries');

router.route('/').get(getAllFilmForSeries);
router.route('/from-page').get(getAllFilmForSeriesPage);
router.route('/:number').get(getFilmForSeriesFromNumber);

module.exports = router;
