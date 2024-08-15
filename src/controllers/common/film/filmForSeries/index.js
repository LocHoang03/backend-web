const FilmForSeries = require('../../../../models/filmForSeries');

exports.getAllFilmForSeries = async (req, res, next) => {
  const film = await FilmForSeries.find({ seriesId: req.params.seriesId })
    .sort({ filmSerialNumber: 1 })

    .populate('seriesId');

  res.status(200).json({
    data: film,
    success: true,
    message: `Get all film successfully.`,
  });
};

exports.getFilmForSeriesFromNumber = async (req, res, next) => {
  const film = await FilmForSeries.find({
    seriesId: req.params.seriesId,
    filmSerialNumber: req.params.number,
  }).populate('seriesId');
  res.status(200).json({
    data: film,
    success: true,
    message: `Get film successfully.`,
  });
};

exports.getAllFilmForSeriesPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  let count, film;
  if (trash === 'false') {
    count = await FilmForSeries.find({
      isDelete: false,
      seriesId: req.params.seriesId,
    }).sort({
      createAt: -1,
    });
    film = await FilmForSeries.find({
      isDelete: false,
      seriesId: req.params.seriesId,
    })
      .populate('seriesId')
      .sort({ filmSerialNumber: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await FilmForSeries.find({
      isDelete: true,
      seriesId: req.params.seriesId,
    }).sort({ createAt: -1 });
    film = await FilmForSeries.find({
      isDelete: true,
      seriesId: req.params.seriesId,
    })
      .populate('seriesId')
      .sort({ filmSerialNumber: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
  res.status(200).json({
    data: film,
    success: true,
    count: count.length,
    message: `Get all film successfully.`,
  });
};
