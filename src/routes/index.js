const router = require('express').Router();
const userRouter = require('./user/index');
const adminRouter = require('./admin/index');
const commonRouter = require('./common/index');
const authGoogleRouter = require('./authGoogle/index');

router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/', commonRouter);
router.use('/api/auth', authGoogleRouter);

module.exports = router;
