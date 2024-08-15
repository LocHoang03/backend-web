const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const FilmForSeries = new Schema({
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
  filmSerialNumber: { type: Number, required: true },
  seriesId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Series',
  },
  createAt: {
    type: Date,
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model('FilmForSeries', FilmForSeries);
