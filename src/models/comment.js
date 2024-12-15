const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
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
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Movies', 'Series'],
  },
  parentUserId: {
    type: Schema.Types.ObjectId,
    ref: 'Subscriber',
    default: null,
  },
  parentCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  rootCommentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
