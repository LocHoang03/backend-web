const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Message = new Schema({
  roomId: {
    type: String,
    required: true,
  },
  participants: {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Subscriber',
    },
    adminId: {
      type: mongoose.Types.ObjectId,
      default: undefined,
      ref: 'User',
    },
  },
  messages: [
    {
      input: {
        type: String,
        required: true,
      },
      file: {
        type: {
          type: String,
          required: true,
          enum: ['video', 'image'],
        },
        imageId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      userId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      avatar: {
        imageId: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    },
  ],
  isReadStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  isChatStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  createAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

module.exports = mongoose.model('Message', Message);
