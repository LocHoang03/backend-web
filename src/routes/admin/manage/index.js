const router = require('express').Router();
const userRouter = require('./user/index');
const subscriberRouter = require('./subscriber/index');


router.use('/subscriber',subscriberRouter);
router.use('/user',userRouter);

module.exports = router;