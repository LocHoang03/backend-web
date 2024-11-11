const Movies = require('../../../../models/movies');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');

exports.getAllMovies = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false }).sort({ createAt: -1 });

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get all movies successfully.`,
  });
};

exports.getMoviesFeature = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false })
    .sort({ createAt: -1 })
    .limit(10);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesMostNew = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false })
    .sort({ createAt: -1 })
    .limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesMostView = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false })
    .sort({ view: -1 })
    .limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesMostRating = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false })
    .sort({ rating: -1 })
    .limit(6);

  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.getMoviesCanWantToMatch = async (req, res, next) => {
  const film = await Movies.findById(req.params.filmId);

  if (!film) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.params.filmId}!!`, 401),
    );
  }
  const movies = await Movies.find({
    listCategoryId: { $in: film.listCategoryId },
    isDelete: false,
  })
    .sort({ createAt: -1 })
    .limit(10);
  res.status(200).json({
    data: movies,
    success: true,
    count: movies.length,
    message: `Get movies feature successfully.`,
  });
};

exports.postHandleLikeMovies = AsyncHandler(async (req, res, next) => {
  const movies = await Movies.findById(req.body.filmId);
  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.body.filmId}!!`, 401),
    );
  }
  try {
    let updatedDocument;
    if (!req.body.isLike) {
      updatedDocument = await Movies.findByIdAndUpdate(
        req.body.filmId,
        { $push: { listUserIdLike: req.body.userId } },
        { new: true },
      );
    } else {
      updatedDocument = await Movies.findByIdAndUpdate(
        req.body.filmId,
        { $pull: { listUserIdLike: req.body.userId } },
        { new: true },
      );
    }

    res.status(201).json({
      success: true,
      data: updatedDocument,
      message: `Update list id user like movies ${req.body.filmId} successfully`,
    });
  } catch (err) {
    console.error(err);
    return next(
      new ErrorResponse(`Error updating movies: ${err.message}`, 500),
    );
  }
});

exports.postHandleRatingMovies = AsyncHandler(async (req, res, next) => {
  const movies = await Movies.findById(req.body.filmId);
  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.body.filmId}!!`, 401),
    );
  }

  if (
    !movies.listUserIdRating.some(
      (data) => data.userId.toString() === req.body.userId.toString(),
    )
  ) {
    const newRating =
      Math.round(
        ((movies.totalRating * movies.rating + req.body.valueRating) /
          (movies.totalRating + 1)) *
          10,
      ) / 10;
    const newTotalRating = movies.totalRating + 1;
    try {
      const updatedDocument = await Movies.findByIdAndUpdate(
        req.body.filmId,
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
        message: `Update list id user like movies ${req.body.filmId} successfully`,
      });
    } catch (err) {
      console.error(err);
      return next(
        new ErrorResponse(`Error updating movies: ${err.message}`, 500),
      );
    }
  } else {
    return next(
      new ErrorResponse(
        `User id ${req.body.userId} liked movies ${req.body.filmId} !!`,
        401,
      ),
    );
  }
});
