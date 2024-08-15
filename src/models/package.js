const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Package = new Schema({
  typePack: {
    type: String,
    required: true,
  },
  monthlyPrice: {
    type: Number,
    required: true,
  },
  qualityPicture: {
    type: String,
    required: true,
  },
  resolution: {
    type: String,
    required: true,
  },
  deviceSupport: {
    type: String,
    required: true,
  },
  quantityWatch: {
    type: Number,
    required: true,
  },
  quantityDownload: {
    type: Number,
    required: true,
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Package', Package);
