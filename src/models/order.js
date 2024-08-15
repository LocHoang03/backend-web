const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Order = new Schema({
  packageId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Package',
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Subscriber',
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
  },
  expirationDate: {
    type: Date,
  },
});

module.exports = mongoose.model('Order', Order);
