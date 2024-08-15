const router = require('express').Router();
const {
  getAllSubscriber,
  getSubscriberTop5,
  getSubscriberOrderTop5,
  postBannedSubscriber,
  postRecoverSubscriber,
  getAllSubscriberFromPage,
  getAllSubscriberFetchLook,
} = require('../../../../controllers/admin/manage/subscriber');
const CheckToken = require('../../../../middlewares/checkToken');
const checkRoles = require('../../../../middlewares/checkRoles');

router.route('/').get(CheckToken, getAllSubscriber);
router.route('/from-page').get(getAllSubscriberFromPage);
router.route('/fetch-look').get(getAllSubscriberFetchLook);
router.route('/subscriber-today').get(getSubscriberTop5);
router.route('/subscriber-order-today').get(getSubscriberOrderTop5);
router.route('/banned-subscriber').post(postBannedSubscriber);
router.route('/recover-subscriber').post(postRecoverSubscriber);

module.exports = router;
