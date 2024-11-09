const { json } = require('express');
const Message = require('../../../models/message');
const ErrorResponse = require('../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteImageCloud } = require('../../../helpers/uploadImage');
const { deleteVideoCloud } = require('../../../helpers/uploadVideo');

exports.postCreateMessage = AsyncHandler(async (req, res, next) => {
  const message = await Message.create({
    roomId: req.body.roomId,
    participants: req.body.participants,
  });
  if (!message) {
    return next(
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }
  res.status(201).json({
    success: true,
    data: message,
    message: 'Tạo tin nhắn thành công.',
  });
});

exports.postUpdateMessage = AsyncHandler(async (req, res, next) => {
  const dataAvatar = JSON.parse(req.body.avatar);
  let currentTime = new Date();
  currentTime.setSeconds(currentTime.getSeconds() + 1);
  let formattedTime = `${currentTime.getHours()}:${
    currentTime.getMinutes() > 9
      ? currentTime.getMinutes()
      : '0' + currentTime.getMinutes()
  }`;
  let data = {
    ...req.body,
    avatar: dataAvatar,
    time: formattedTime,
  };
  if (req.files['file']) {
    delete data['input'];
    delete data['file'];

    data = {
      ...data,
      time: formattedTime,
      file: {
        type: req.files['file'][0].mimetype.split('/')[0],
        url: req.files['file'][0].path,
        imageId: req.files['file'][0].filename.split('/')[1],
      },
    };
  } else {
    delete data['file'];
  }

  const message = await Message.findOne({ roomId: req.params.roomId });
  if (!message) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy tin nhắn có phòng Id ${req.params.roomId}!!`,
        401,
      ),
    );
  }
  const filter = { roomId: req.params.roomId };
  const update = {
    $push: {
      messages: data,
    },
  };

  await Message.updateOne(filter, update);

  const dataMessage = await Message.findOne({ roomId: req.params.roomId });

  res.status(201).json({
    data: dataMessage,
    success: true,
    message: `Cập nhật tin nhắn với phòng Id ${req.params.roomId} thành công.`,
  });
});

exports.postUpdateOff = AsyncHandler(async (req, res, next) => {
  if (!req.params.roomId) {
    return next(new ErrorResponse(`Vui lòng nhập Id phòng hợp lệ!!`, 401));
  }

  const message = await Message.findOne({ roomId: req.params.roomId });

  if (!message) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy tin nhắn có phòng Id ${req.params.roomId}!!`,
        401,
      ),
    );
  }

  await Message.updateOne(
    { roomId: req.params.roomId },
    { isChatStatus: false },
  );

  for (const item of message.messages) {
    if (!item.input) {
      if (item.file.type === 'image') {
        await deleteImageCloud('image-handle/' + item.file.imageId);
      } else {
        await deleteVideoCloud('video-handle/' + item.file.imageId);
      }
    }
  }

  res.status(201).json({
    success: true,
    message: `Cập nhật trạng thái phòng trò chuyện trực tiếp Id ${req.body.roomId} thành công.`,
  });
});

exports.postUpdateJoinChat = AsyncHandler(async (req, res, next) => {
  try {
    const message = await Message.findOne({ roomId: req.body.roomId });

    if (!message) {
      return next(
        new ErrorResponse(
          `Không thể tìm thấy tin nhắn có phòng Id ${req.body.roomId}`,
          404,
        ),
      );
    }

    await Message.updateOne(
      { roomId: req.body.roomId },
      { 'participants.adminId': req.body.userId },
    );

    res
      .status(200)
      .json({ success: true, message: 'Admin updated successfully' });
  } catch (err) {
    return next(new ErrorResponse('Lỗi cập nhật quản trị viên', 500));
  }
});
