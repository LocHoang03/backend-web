const Comment = require('../../../models/comment');
const AsyncHandler = require('express-async-handler');
const ErrorResponse = require('../../../utils/errorResponse');

exports.getAllComment = async (req, res, next) => {
  const comment = await Comment.find()
    .populate('userId')
    .populate('parentUserId')
    .sort({ createAt: -1 });
  res.status(200).json({
    data: comment,
    success: true,
    count: comment.length,
    message: `Get all comment successfully.`,
  });
};

exports.postAddComment = AsyncHandler(async (req, res, next) => {
  let newComment;
  if (req.query.reply === 'true') {
    newComment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      moviesId: req.body.moviesId,
      parentCommentId: req.body.parentCommentId,
      parentUserId: req.body.parentUserId.userId,
      rootCommentId: req.body.rootCommentId,
      createAt: Date.now(),
    });
  } else {
    newComment = await Comment.create({
      content: req.body.content,
      userId: req.body.userId,
      moviesId: req.body.moviesId,
      createAt: Date.now(),
    });
  }
  if (newComment) {
    return res.status(200).json({
      data: newComment,
      success: true,
      message: 'Tạo bình luận thành công.',
      version: 1.0,
    });
  } else {
    return next(
      new ErrorResponse('Server đang gặp sự cố, vui lòng thử lại sau!!', 401),
    );
  }
});

exports.postDeleteComment = async (req, res, next) => {
  if (!req.params.commentId) {
    return next(
      new ErrorResponse(`Please enter a valid id comment delete`, 404),
    );
  }

  const comment = await Comment.deleteOne({ _id: req.params.commentId });

  if (!comment) {
    return next(
      new ErrorResponse(`Server đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }

  res.status(201).json({
    success: true,
    message: `Xóa bình luận thành công.`,
  });
};

exports.postUpdateComment = AsyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.body.commentId);
  if (!comment) {
    return next(
      new ErrorResponse(`Cannot find comment id ${req.body.commentId}!!`, 401),
    );
  }
  comment.content = req.body.content;

  await comment.save();
  res.status(201).json({
    success: true,
    data: comment,
    message: `Cập nhật bình luận thành công.`,
  });
});
