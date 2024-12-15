const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
require('dotenv').config();

const Subscriber = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  sex: {
    type: String,
    required: false,
    enum: ['Nam', 'Nữ'],
  },
  avatarUser: {
    imageId: {
      type: String,
      required: true,
      default: process.env.IMAGE_ID_DEFAULT,
    },
    url: {
      type: String,
      required: true,
      default: process.env.IMAGE_URL_DEFAULT,
    },
  },
  twoFactor: {
    auth: {
      type: Boolean,
      required: true,
      default: false,
    },
    code: {
      type: String,
      required: false,
    },
    time: {
      type: Date,
    },
    resend: {
      type: Date,
    },
  },
  password: {
    type: String,
    required: false,
  },
  isBanned: {
    type: Boolean,
    required: true,
    default: false,
  },
  lockReason: {
    type: String,
    required: false,
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  resetToken: String,
  tokenExpiration: Date,
});

module.exports = mongoose.model('Subscriber', Subscriber);
