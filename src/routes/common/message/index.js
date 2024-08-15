const router = require('express').Router();
const MessageController = require('../../../controllers/common/message');

router.route('/get-on').get(MessageController.getOnMessage);
router.route('/get-message-user/:userId').get(MessageController.getMessageUser);

module.exports = router;
