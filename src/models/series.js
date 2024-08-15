const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Series = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    imageId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  videoUrl: {
    videoId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  releaseDate: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  cast: {
    type: String,
    required: true,
  },
  country: [{ type: String, required: true }],
  listCategoryId: [
    { type: mongoose.Types.ObjectId, required: true, ref: 'Category' },
  ],
  listUserIdLike: [
    { type: mongoose.Types.ObjectId, required: true, ref: 'Subscriber' },
  ],
  listUserIdRating: [
    {
      userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Subscriber',
      },
      valueRating: { type: Number, required: true },
    },
  ],
  listPackageIdBand: [{ type: mongoose.Types.ObjectId, required: false }],
  totalRating: { type: Number, required: true, default: 100 },
  rating: { type: Number, required: true, default: 5 },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('Series', Series);
