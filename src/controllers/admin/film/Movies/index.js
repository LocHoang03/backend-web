const Movies = require('../../../../models/movies');
const Comment = require('../../../../models/comment');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteImageCloud } = require('../../../../helpers/uploadImage');
const { deleteVideoCloud } = require('../../../../helpers/uploadVideo');
const { getVideoDurationInSeconds } = require('get-video-duration');
const csv = require('csvtojson');
const DeleteFile = require('../../../../utils/deleteFile');

exports.postCreateMovies = AsyncHandler(async (req, res, next) => {
  if (
    !req.files['imageUrl'] ||
    !req.files['videoUrl'] ||
    !req.files['videoTrailerUrl']
  ) {
    return next(
      new ErrorResponse(`Vui lòng nhập tệp hình ảnh và video hợp lệ!!`, 404),
    );
  }

  const infoVideoTrailer = {
    videoId: req.files['videoTrailerUrl'][0].filename,
    url: req.files['videoTrailerUrl'][0].path,
  };
  const infoImage = {
    imageId: req.files['imageUrl'][0].filename,
    url: req.files['imageUrl'][0].path,
  };
  const infoVideo = {
    videoId: req.files['videoUrl'][0].filename,
    url: req.files['videoUrl'][0].path,
  };

  const duration = await getVideoDurationInSeconds(
    req.files['videoUrl'][0].path,
  );
  let resultDuration;
  if (duration % 60 < 5) {
    resultDuration = Math.floor(duration / 60);
  } else {
    resultDuration = Math.ceil(duration / 60);
  }

  const movies = await Movies.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    director: req.body.director,
    cast: req.body.cast,
    country: req.body.country.split(','),
    duration: resultDuration,
    videoTrailerUrl: infoVideoTrailer,
    imageUrl: infoImage,
    videoUrl: infoVideo,
    createAt: Date.now(),
    listCategoryId: req.body.listCategoryId.split(','),
    listPackageIdBand: req.body.listPackageIdBand
      ? req.body.listPackageIdBand.split(',')
      : [],
  });
  if (!movies) {
    return next(
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }

  res.status(201).json({
    success: true,
    data: movies,
    message: 'Tạo phim thành công.',
  });
});

exports.postDeleteMovies = AsyncHandler(async (req, res, next) => {
  if (!req.params.moviesId) {
    return next(
      new ErrorResponse(`Please enter a valid id movies delete`, 404),
    );
  }
  if (!req.body.type) {
    return next(new ErrorResponse(`Please send type movies delete`, 404));
  }

  const movies = await Movies.findById(req.params.moviesId);

  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.params.moviesId}!!`, 401),
    );
  }
  if (req.body.type === 'delete') {
    movies.isDelete = true;
    await movies.save();
  } else {
    await deleteImageCloud(movies.imageUrl.imageId);
    await deleteVideoCloud(movies.videoTrailerUrl.videoId);
    await deleteVideoCloud(movies.videoUrl.videoId);
    await Comment.deleteMany({
      moviesId: req.params.moviesId,
      onModel: 'Movies',
    });
    await Movies.deleteOne({ _id: req.params.moviesId });
  }

  res.status(201).json({
    success: true,
    message: `Xóa phim thành công.`,
  });
});

exports.postUpdateMovies = AsyncHandler(async (req, res, next) => {
  const movies = await Movies.findById(req.params.moviesId);

  if (!movies) {
    return next(
      new ErrorResponse(`Cannot find movies id ${req.params.moviesId}!!`, 401),
    );
  }

  let infoVideoTrailer, infoImage, infoVideo, duration, resultDuration;
  if (req.files['videoTrailerUrl']) {
    let delete1 = await deleteVideoCloud(movies.videoTrailerUrl.videoId);
    infoVideoTrailer = {
      videoId: req.files['videoTrailerUrl'][0].filename,
      url: req.files['videoTrailerUrl'][0].path,
    };
  }
  if (req.files['imageUrl']) {
    await deleteImageCloud(movies.imageUrl.imageId);
    infoImage = {
      imageId: req.files['imageUrl'][0].filename,
      url: req.files['imageUrl'][0].path,
    };
  }
  if (req.files['videoUrl']) {
    await deleteVideoCloud(movies.videoUrl.videoId);
    infoVideo = {
      videoId: req.files['videoUrl'][0].filename,
      url: req.files['videoUrl'][0].path,
    };
    duration = await getVideoDurationInSeconds(req.files['videoUrl'][0].path);
    if (duration % 60 < 5) {
      resultDuration = Math.floor(duration / 60);
    } else {
      resultDuration = Math.ceil(duration / 60);
    }
  }

  movies.title = req.body.title;
  movies.releaseDate = +req.body.releaseDate;
  movies.description = req.body.description;
  movies.director = req.body.director;
  movies.cast = req.body.cast;
  movies.country = req.body.country.split(',');
  if (req.files['videoTrailerUrl']) {
    movies.videoTrailerUrl = infoVideoTrailer;
  }
  if (req.files['imageUrl']) {
    movies.imageUrl = infoImage;
  }
  if (req.files['videoUrl']) {
    movies.videoUrl = infoVideo;
    movies.duration = resultDuration;
  }

  movies.listCategoryId = req.body.listCategoryId.split(',');
  movies.listPackageIdBand = req.body.listPackageIdBand
    ? req.body.listPackageIdBand.split(',')
    : [];
  try {
    await movies.save();
  } catch (error) {
    console.error('Lỗi lưu phim:', error);
  }

  res.status(201).json({
    success: true,
    data: movies,
    message: `Cập nhật phim thành công`,
  });
});

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
    return next(new ErrorResponse(`Lỗi cập nhật phim: ${err.message}`, 500));
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
      return next(new ErrorResponse(`Lỗi cập nhật phim: ${err.message}`, 500));
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

exports.postAddManyMovies = AsyncHandler(async (req, res, next) => {
  const jsonArray = await csv().fromFile(req.file.path);
  let count = 0;
  for (let i = 0; i < jsonArray.length; i++) {
    if (
      jsonArray[i].title === '' ||
      jsonArray[i].description === '' ||
      jsonArray[i].imageId === '' ||
      jsonArray[i].imageUrl === '' ||
      jsonArray[i].videoTrailerId === '' ||
      jsonArray[i].videoTrailerUrl === '' ||
      jsonArray[i].videoId === '' ||
      jsonArray[i].videoUrl === '' ||
      jsonArray[i].releaseDate === '' ||
      jsonArray[i].director === '' ||
      jsonArray[i].cast === '' ||
      jsonArray[i].country === '' ||
      jsonArray[i].duration === '' ||
      jsonArray[i].listCategoryId === ''
    ) {
      count = i + 1;
      return next(
        new ErrorResponse(
          `Phát hiện lỗi dữ liệu excel ở số dòng ${count}!!`,
          401,
        ),
      );
    }
  }
  Promise.all([
    jsonArray.map(async (item, id) => {
      await Movies.create({
        title: item.title,
        releaseDate: +item.releaseDate,
        description: item.description,
        director: item.director,
        cast: item.cast,
        country: item.country.split(','),
        duration: +item.duration,
        imageUrl: {
          imageId: item.imageId,
          url: item.imageUrl,
        },
        videoTrailerUrl: {
          videoId: item.videoTrailerId,
          url: item.videoTrailerUrl,
        },
        videoUrl: {
          videoId: item.videoId,
          url: item.videoUrl,
        },
        createAt: Date.now(),
        listCategoryId: item.listCategoryId.split(','),
        listPackageIdBand: req.body.listPackageIdBand
          ? req.body.listPackageIdBand.split(',')
          : [],
      });
    }),
  ]);

  await DeleteFile(req.file.path);
  const page = 1;
  const limit = 10;
  const countMovies = await Movies.find({ isDelete: false });
  const movies = await Movies.find({ isDelete: false })
    .sort({ releaseDate: -1, createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.status(201).json({
    success: true,
    data: movies,
    count: countMovies.length,
    message: 'Tạo nhiều phim thành công.',
  });
});

exports.postRecoverMovies = AsyncHandler(async (req, res, next) => {
  const movies = await Movies.findById(req.body.dataId);

  if (!movies) {
    return next(
      new ErrorResponse(`Không tìm thấy id phim ${req.body.dataId}!!`, 401),
    );
  }
  movies.isDelete = false;
  await movies.save();
  res.status(200).json({
    success: true,
    message: 'Thay đổi trạng thái phim thành công',
  });
});

exports.postCheckNameFilm = AsyncHandler(async (req, res, next) => {
  let film;
  console.log(req.body);

  if (req.body.type === 'update') {
    film = await Movies.find({
      $and: [{ _id: { $ne: req.body.filmId } }, { title: req.body.title }],
    });
  } else {
    film = await Movies.find({
      title: req.body.title,
    });
  }

  if (film.length > 0) {
    return next(new ErrorResponse(`Tên phim này đã tồn tại!!!`, 401));
  }

  res.status(201).json({
    success: true,
    version: 1.0,
  });
});
