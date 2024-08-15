const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const CommonQuestions = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('CommonQuestions', CommonQuestions);
