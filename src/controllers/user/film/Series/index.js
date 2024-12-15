const Series = require('../../../../models/series');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllSeries = async (req, res, next) => {
  const series = await Series.find({ isDelete: false }).sort({ createAt: -1 });

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get all series successfully.`,
  });
};

exports.getSeriesFeature = async (req, res, next) => {
  const series = await Series.find({ isDelete: false })
    .sort({ createAt: -1 })
    .limit(10);

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get series feature successfully.`,
  });
};

exports.getSeriesMostNew = async (req, res, next) => {
  const movies = await Series.find({ isDelete: false })
    .sort({ createAt: -1 })
    .limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getSeriesMostView = async (req, res, next) => {
  const series = await Series.aggregate([
    { $match: { isDelete: false } },
    { $sample: { size: 6 } },
  ]);

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get series feature successfully.`,
  });
};

exports.getSeriesMostRating = async (req, res, next) => {
  const series = await Series.find({ isDelete: false })
    .sort({ rating: -1 })
    .limit(6);

  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get series feature successfully.`,
  });
};

exports.getSeriesCanWantToMatch = async (req, res, next) => {
  const film = await Series.findById(req.params.filmId);

  if (!film) {
    return next(
      new ErrorResponse(`Cannot find series id ${req.params.filmId}!!`, 401),
    );
  }
  const series = await Series.find({
    listCategoryId: { $in: film.listCategoryId },
    isDelete: false,
  })
    .sort({ createAt: -1 })
    .limit(10);
  res.status(200).json({
    data: series,
    success: true,
    count: series.length,
    message: `Get series feature successfully.`,
  });
};

exports.postHandleLikeSeries = AsyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.body.seriesId);

  if (!series) {
    return next(
      new ErrorResponse(`Cannot find series id ${req.body.seriesId}!!`, 401),
    );
  }

  try {
    let updatedDocument;
    if (!req.body.isLike) {
      updatedDocument = await Series.findByIdAndUpdate(
        req.body.seriesId,
        { $push: { listUserIdLike: req.body.userId } },
        { new: true },
      );
    } else {
      updatedDocument = await Series.findByIdAndUpdate(
        req.body.seriesId,
        { $pull: { listUserIdLike: req.body.userId } },
        { new: true },
      );
    }
    res.status(201).json({
      success: true,
      data: updatedDocument,
      message: `Update list id user like series ${req.body.seriesId} successfully`,
    });
  } catch (err) {
    return next(
      new ErrorResponse(`Error updating movies: ${err.message}`, 500),
    );
  }
});

exports.postHandleRatingSeries = AsyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.body.seriesId);
  if (!series) {
    return next(
      new ErrorResponse(`Cannot find series id ${req.body.seriesId}!!`, 401),
    );
  }

  if (
    !series.listUserIdRating.some(
      (data) => data.userId.toString() === req.body.userId.toString(),
    )
  ) {
    const newRating =
      Math.round(
        ((series.totalRating * series.rating + req.body.valueRating) /
          (series.totalRating + 1)) *
          10,
      ) / 10;
    const newTotalRating = series.totalRating + 1;
    try {
      const updatedDocument = await Series.findByIdAndUpdate(
        req.body.seriesId,
        {
          rating: newRating,
          totalRating: newTotalRating,
          $push: {
            listUserIdRating: {
              userId: req.body.userId,
              valueRating: req.body.valueRating,
            },
          },
        },
        { new: true },
      );

      res.status(201).json({
        success: true,
        data: updatedDocument,
        message: `Update list id user like series ${req.body.seriesId} successfully`,
      });
    } catch (err) {
      return next(
        new ErrorResponse(`Error updating series: ${err.message}`, 500),
      );
    }
  } else {
    return next(
      new ErrorResponse(
        `User id ${req.body.userId} liked series ${req.body.seriesId} !!`,
        401,
      ),
    );
  }
});
