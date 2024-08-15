const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Comment = new Schema({
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Subscriber',
  },

  moviesId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Movies',
  },
  parentUserId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Subscriber',
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Movies',
  },
  rootCommentId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Movies',
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Comment', Comment);
