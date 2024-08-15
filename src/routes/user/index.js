const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');
const commentRouter = require('./comment/index');
const paymentRouter = require('./payment/index');
const orderRouter = require('./order/index');

router.use('/auth', authRouter);
router.use('/film', filmRouter);
router.use('/comment', commentRouter);
router.use('/payment', paymentRouter);
router.use('/order', orderRouter);

module.exports = router;
