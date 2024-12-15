const Series = require('../../../../models/series');
const Comment = require('../../../../models/comment');
const FilmForSeries = require('../../../../models/filmForSeries');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteImageCloud } = require('../../../../helpers/uploadImage');
const { deleteVideoCloud } = require('../../../../helpers/uploadVideo');
const csv = require('csvtojson');
const DeleteFile = require('../../../../utils/deleteFile');

exports.postCreateSeries = AsyncHandler(async (req, res, next) => {
  if (!req.files['imageUrl'] || !req.files['videoTrailerUrl']) {
    return next(
      new ErrorResponse(
        `Vui lòng nhập tệp hình ảnh và video trailer hợp lệ!!`,
        404,
      ),
    );
  }

  const infoImage = {
    imageId: req.files['imageUrl'][0].filename,
    url: req.files['imageUrl'][0].path,
  };
  const infoVideoTrailer = {
    videoId: req.files['videoTrailerUrl'][0].filename,
    url: req.files['videoTrailerUrl'][0].path,
  };

  const series = await Series.create({
    title: req.body.title,
    releaseDate: req.body.releaseDate,
    description: req.body.description,
    director: req.body.director,
    cast: req.body.cast,
    country: req.body.country.split(','),
    imageUrl: infoImage,
    videoUrl: infoVideoTrailer,
    listCategoryId: req.body.listCategoryId.split(','),
    listPackageIdBand: req.body.listPackageIdBand
      ? req.body.listPackageIdBand.split(',')
      : [],
    createAt: Date.now(),
  });

  if (!series) {
    return next(
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }

  res.status(201).json({
    success: true,
    data: series,
    message: 'Tạo phim thành công.',
  });
});

exports.postDeleteSeries = AsyncHandler(async (req, res, next) => {
  if (!req.params.seriesId) {
    return next(new ErrorResponse(`Vui lòng nhập dãy id hợp lệ xóa`, 404));
  }

  if (!req.body.type) {
    return next(new ErrorResponse(`Vui lòng gửi loại xóa loạt`, 404));
  }

  const series = await Series.findById(req.params.seriesId);

  if (!series) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy id phim ${req.params.seriesId}!!`,
        401,
      ),
    );
  }
  if (req.body.type === 'delete') {
    series.isDelete = true;
    await series.save();
  } else {
    await deleteImageCloud(series.imageUrl.imageId);
    await deleteVideoCloud(series.videoUrl.videoId);
    const film = await FilmForSeries.find({ seriesId: req.params.seriesId });
    if (film.length > 0) {
      await Promise.all(
        film.map(async (item) => {
          await deleteVideoCloud(item.videoUrl.videoId);
        }),
      );
    }
    await FilmForSeries.deleteMany({ seriesId: req.params.seriesId });
    await Comment.deleteMany({
      moviesId: req.params.seriesId,
      onModel: 'Series',
    });
    await Series.deleteOne({ _id: req.params.seriesId });
  }

  res.status(201).json({
    success: true,
    message: `delete series ${req.params.seriesId} successfully`,
  });
});

exports.postUpdateSeries = AsyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.params.seriesId);

  if (!series) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy id bộ truyện ${req.params.seriesId}!!`,
        401,
      ),
    );
  }
  let infoVideoTrailer, infoImage;
  if (req.files['imageUrl']) {
    await deleteImageCloud(series.imageUrl.imageId);
    infoImage = {
      imageId: req.files['imageUrl'][0].filename,
      url: req.files['imageUrl'][0].path,
    };
  }
  if (req.files['videoTrailerUrl']) {
    await deleteVideoCloud(series.videoUrl.videoId);
    infoVideoTrailer = {
      videoId: req.files['videoTrailerUrl'][0].filename,
      url: req.files['videoTrailerUrl'][0].path,
    };
  }

  series.title = req.body.title;
  series.releaseDate = req.body.releaseDate;
  series.description = req.body.description;
  series.director = req.body.director;
  series.cast = req.body.cast;
  series.country = req.body.country.split(',');
  if (req.files['imageUrl']) {
    series.imageUrl = infoImage;
  }
  if (req.files['videoTrailerUrl']) {
    series.videoUrl = infoVideoTrailer;
  }
  series.listCategoryId = req.body.listCategoryId.split(',');
  series.listPackageIdBand = req.body.listPackageIdBand
    ? req.body.listPackageIdBand.split(',')
    : [];

  try {
    await series.save();
  } catch (error) {
    console.error('Error series:', error);
  }
  res.status(201).json({
    success: true,
    data: series,
    message: `Cập nhật phim thành công`,
  });
});

exports.postRecoverSeries = AsyncHandler(async (req, res, next) => {
  const series = await Series.findById(req.body.dataId);

  if (!series) {
    return next(
      new ErrorResponse(
        `Không thể tìm thấy id bộ truyện ${req.body.dataId}!!`,
        401,
      ),
    );
  }
  series.isDelete = false;
  await series.save();
  res.status(200).json({
    success: true,
    message: 'Đã thay đổi trạng thái phim thành công',
  });
});

exports.postAddManyMovies = AsyncHandler(async (req, res, next) => {
  const jsonArray = await csv().fromFile(req.file.path);
  let count = 0;
  for (let i = 0; i < jsonArray.length; i++) {
    if (
      jsonArray[i].title === '' ||
      jsonArray[i].description === '' ||
      jsonArray[i].videoId === '' ||
      jsonArray[i].videoUrl === '' ||
      jsonArray[i].imageId === '' ||
      jsonArray[i].imageUrl === '' ||
      jsonArray[i].releaseDate === '' ||
      jsonArray[i].director === '' ||
      jsonArray[i].cast === '' ||
      jsonArray[i].country === '' ||
      jsonArray[i].duration === '' ||
      jsonArray[i].listCategoryId === '' ||
      jsonArray[i].listPackageIdBand === ''
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
      await Series.create({
        _id: item._id,
        title: item.title,
        releaseDate: +item.releaseDate,
        description: item.description,
        director: item.director,
        cast: item.cast,
        country: item.country.split(','),
        imageUrl: {
          imageId: item.imageId,
          url: item.imageUrl,
        },
        videoUrl: {
          videoId: item.videoId,
          url: item.videoUrl,
        },
        createAt: Date.now(),
        listCategoryId: item.listCategoryId.split(','),
        listPackageIdBand: item.listPackageIdBand.split(','),
      });
    }),
  ]);
  await DeleteFile(req.file.path);
  const page = 1;
  const limit = 10;
  const countSeries = await Series.find({ isDelete: false });
  const series = await Series.find({ isDelete: false })
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.status(201).json({
    success: true,
    data: series,
    count: countSeries.length,
    message: 'Tạo nhiều phim thành công',
  });
});

exports.postCheckNameSeries = AsyncHandler(async (req, res, next) => {
  let film;
  console.log(req.body);
  if (req.body.type === 'update') {
    film = await Series.find({
      $and: [{ _id: { $ne: req.body.seriesId } }, { title: req.body.title }],
    });
  } else {
    film = await Series.find({
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
