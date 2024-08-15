const router = require('express').Router();
const userRouter = require('./user/index');
const adminRouter = require('./admin/index');
const commonRouter = require('./common/index');

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/', commonRouter);

module.exports = router;
