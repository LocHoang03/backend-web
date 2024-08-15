const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');
const categoryRouter = require('./category/index');
const paymentRouter = require('./payment/index');
const packageRouter = require('./package/index');
const commonQuestionRouter = require('./setting/commonQuestion');
const customerQuestionRouter = require('./setting/customerQuestion');
const messageRouter = require('./message');
const orderRouter = require('./order');
const countryRouter = require('./country');

router.use('/auth', authRouter);
router.use('/film', filmRouter);
router.use('/category', categoryRouter);
router.use('/payment', paymentRouter);
router.use('/payment', paymentRouter);
router.use('/package', packageRouter);
router.use('/common-questions', commonQuestionRouter);
router.use('/customer-questions', customerQuestionRouter);
router.use('/message', messageRouter);
router.use('/order', orderRouter);
router.use('/country', countryRouter);

module.exports = router;
