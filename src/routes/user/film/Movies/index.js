const router = require('express').Router();
const MoviesController = require('../../../../controllers/user/film/Movies/index');
const CheckToken = require('../../../../middlewares/checkToken');


router.route('/movies-feature').get(MoviesController.getMoviesFeature);

router.route('/most-new').get(MoviesController.getMoviesMostNew);

router.route('/most-view').get(MoviesController.getMoviesMostView);

router.route('/most-rating').get(MoviesController.getMoviesMostRating);

router
  .route('/can-to-match/:filmId')
  .get(MoviesController.getMoviesCanWantToMatch);

router
  .route('/handle-like-movies')
  .post(CheckToken, MoviesController.postHandleLikeMovies);

router
  .route('/handle-rating-movies')
  .post(CheckToken, MoviesController.postHandleRatingMovies);

// router.route('/test-image').post(upload, MoviesController.testPostUrl);

module.exports = router;
