const cron = require('node-cron');
const Order = require('../models/order');

cron.schedule('* * * * *', async () => {
  try {
    const expiredOrders = await Order.find({
      expirationDate: { $lte: Date.now() },
    })
      .sort({ createAt: -1 })
      .populate('packageId');

    if (expiredOrders.length > 0) {
      for (const order of expiredOrders) {
        order.isDelete = true;
        await order.save();
      }
    }
  } catch (error) {}
});

module.exports = cron;
