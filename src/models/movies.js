const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const Movies = new Schema({
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
  videoTrailerUrl: {
    videoId: {
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
  duration: { type: Number, required: true },
  rating: { type: Number, required: true, default: 5 },
  createAt: {
    type: Date,
  },

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
        ref: 'UserSubscriber',
      },
      valueRating: { type: Number, required: true },
    },
  ],
  listPackageIdBand: [
    { type: mongoose.Types.ObjectId, required: false, ref: 'Package' },
  ],
  totalRating: { type: Number, required: true, default: 100 },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('Movies', Movies);
