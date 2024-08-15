const router = require('express').Router();
const SeriesController = require('../../../../controllers/common/film/Series/index');
const FilmForSeriesRouter = require('../filmForSeries/index');

router.route('/').get(SeriesController.getAllSeries);
router.route('/from-page').get(SeriesController.getAllSeriesFromPage);
router.route('/fetch-look').get(SeriesController.getAllSeriesFetchLook);
router.route('/get-new-series').get(SeriesController.getNewSeries);

router.use('/:seriesId', FilmForSeriesRouter);

module.exports = router;
