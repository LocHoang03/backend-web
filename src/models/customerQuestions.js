const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const CustomerQuestions = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Subscriber',
  },
  explanation: {
    type: String,
    required: false,
  },
  isHandle: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('CustomerQuestions', CustomerQuestions);
