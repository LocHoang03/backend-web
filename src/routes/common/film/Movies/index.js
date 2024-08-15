const router = require('express').Router();
const MoviesController = require('../../../../controllers/common/film/Movies/index');

router.route('/').get(MoviesController.getAllMovies);
router.route('/from-page').get(MoviesController.getAllMoviesFromPage);
router.route('/fetch-look').get(MoviesController.getAllMoviesFetchLook);
router.route('/get-new-movies').get(MoviesController.getNewMovies);

module.exports = router;
