const router = require('express').Router();
const seriesRouter = require('./series/index');
const moviesRouter = require('./Movies/index');
const filmRouter = require('./filmForSeries/index');

router.use('/movies', moviesRouter);
router.use('/series', seriesRouter);
router.use('/film-for-series', filmRouter);

module.exports = router;
