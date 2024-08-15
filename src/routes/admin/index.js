const router = require('express').Router();
const authRouter = require('./auth/index');
const filmRouter = require('./film/index');
const categoryRouter = require('./category/index');
const manageRouter = require('./manage/index');
const summaryRouter = require('./summary/index');
const packageRouter = require('./package/index');
const paymentRouter = require('./payment/index');
const commonQuestionRouter = require('./setting/commonQuestion');
const customerQuestionRouter = require('./setting/customerQuestion');
const messageQuestionRouter = require('./message');

router.use('/auth', authRouter);
router.use('/film', filmRouter);
router.use('/category', categoryRouter);
router.use('/manage', manageRouter);
router.use('/summary', summaryRouter);
router.use('/package', packageRouter);
router.use('/payment', paymentRouter);
router.use('/common-questions', commonQuestionRouter);
router.use('/customer-questions', customerQuestionRouter);
router.use('/message', messageQuestionRouter);

module.exports = router;
