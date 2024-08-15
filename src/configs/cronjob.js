const cron = require('node-cron');
const Message = require('../models/message');

const startCronJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    await Message.deleteMany();
  });
};

module.exports = { startCronJobs };
