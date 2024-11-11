const Movies = require('../../../../models/movies');

exports.getAllMovies = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false })
    .sort({ createAt: -1 })
    .populate('listCategoryId');

  res.status(200).json({
    data: movies,
    success: true,
    message: `Get all movies successfully.`,
  });
};

exports.getAllMoviesFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  let count, movies;
  if (trash === 'false') {
    count = await Movies.find({ isDelete: false }).sort({ createAt: -1 });
    movies = await Movies.find({ isDelete: false })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await Movies.find({ isDelete: true }).sort({ createAt: -1 });
    movies = await Movies.find({ isDelete: true })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  res.status(200).json({
    data: movies,
    success: true,
    count: count.length,
    message: `Get all movies successfully.`,
  });
};

exports.getAllMoviesFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  const country = req.query.country;
  const name = req.query.name;
  let count, movies;
  if (trash === 'false') {
    if (country !== 'All') {
      count = await Movies.find({
        isDelete: false,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      movies = await Movies.find({
        isDelete: false,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      count = await Movies.find({
        isDelete: false,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      movies = await Movies.find({
        isDelete: false,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }
  } else {
    if (country !== 'All') {
      count = await Movies.find({
        isDelete: true,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      movies = await Movies.find({
        isDelete: true,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      count = await Movies.find({
        isDelete: true,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      movies = await Movies.find({
        isDelete: true,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }
  }
  res.status(200).json({
    data: movies,
    success: true,
    count: count.length,
    message: `Get all series successfully.`,
  });
};

exports.getNewMovies = async (req, res, next) => {
  const movies = await Movies.find({ isDelete: false })
    .sort({ createAt: -1 })
    .limit(5);

  res.status(200).json({
    data: movies,
    success: true,
    message: `Get five new movies successfully.`,
  });
};
