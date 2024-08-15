const router = require('express').Router();
const moviesRouter = require('./Movies/index');
const seriesRouter = require('./series/index');

router.use('/movies', moviesRouter);
router.use('/series', seriesRouter);

module.exports = router;
