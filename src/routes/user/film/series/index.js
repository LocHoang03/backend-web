const router = require('express').Router();
const SeriesController = require('../../../../controllers/user/film/Series/index');
CheckToken = require('../../../../middlewares/checkToken');

router.route('/series-feature').get(SeriesController.getSeriesFeature);

router.route('/most-new').get(SeriesController.getSeriesMostNew);

router.route('/most-view').get(SeriesController.getSeriesMostView);

router.route('/most-rating').get(SeriesController.getSeriesMostRating);

router
  .route('/can-to-match/:filmId')
  .get(SeriesController.getSeriesCanWantToMatch);

router
  .route('/handle-like-series')
  .post(CheckToken, SeriesController.postHandleLikeSeries);

router
  .route('/handle-rating-series')
  .post(CheckToken, SeriesController.postHandleRatingSeries);

module.exports = router;
