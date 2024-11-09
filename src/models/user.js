const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
require('dotenv').config();

const User = new Schema({
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
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
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
  role: {
    type: String,
    required: true,
    enum: ['superAdmin', 'adminCustom', 'adminFilm'],
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('User', User);
