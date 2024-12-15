const FilmForSeries = require('../../../../models/filmForSeries');
const ErrorResponse = require('../../../../utils/errorResponse');
const AsyncHandler = require('express-async-handler');
const { deleteVideoCloud } = require('../../../../helpers/uploadVideo');
const { getVideoDurationInSeconds } = require('get-video-duration');
const csv = require('csvtojson');
const DeleteFile = require('../../../../utils/deleteFile');

exports.getAllFilmForSeries = AsyncHandler(async (req, res, next) => {});

exports.postCreateFilmForSeries = AsyncHandler(async (req, res, next) => {
  if (!req.files['videoUrl']) {
    return next(
      new ErrorResponse(`Vui lòng nhập một tập tin video hợp lệ`, 404),
    );
  }

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

  const film = await FilmForSeries.create({
    releaseDate: req.body.releaseDate,
    filmSerialNumber: req.body.filmSerialNumber,
    duration: resultDuration,
    videoUrl: infoVideo,
    createAt: Date.now(),
    seriesId: req.params.seriesId,
  });

  if (!film) {
    return next(
      new ErrorResponse(`Hệ thống đang gặp sự cố, vui lòng thử lại sau!!`, 401),
    );
  }

  res.status(201).json({
    success: true,
    data: film,
    message: 'Tạo phim thành công',
  });
});

exports.postDeleteFilmForSeries = AsyncHandler(async (req, res, next) => {
  if (!req.params.filmId) {
    return next(new ErrorResponse(`Vui lòng nhập id phim hợp lệ xóa`, 404));
  }
  if (!req.body.type) {
    return next(new ErrorResponse(`Xin vui lòng gửi loại phim xóa`, 404));
  }

  const film = await FilmForSeries.findOne({ _id: req.params.filmId });

  if (!film) {
    return next(
      new ErrorResponse(`Không tìm thấy id phim ${req.params.filmId}!!`, 401),
    );
  }
  if (req.body.type === 'delete') {
    film.isDelete = true;
    await film.save();
  } else {
    await deleteVideoCloud(film.videoUrl.videoId);
    await FilmForSeries.deleteOne({ _id: req.params.filmId });
  }

  res.status(201).json({
    success: true,
    message: `Xóa phim thành công.`,
  });
});

exports.postUpdateFilmForSeries = AsyncHandler(async (req, res, next) => {
  const film = await FilmForSeries.findById(req.params.filmId);
  if (!film) {
    return next(
      new ErrorResponse(`Không tìm thấy id phim ${req.params.filmId}!!`, 401),
    );
  }

  let infoVideo, duration, resultDuration;
  if (req.files['videoUrl']) {
    await deleteVideoCloud(film.videoUrl.videoId);

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

  film.releaseDate = req.body.releaseDate;
  film.filmSerialNumber = req.body.filmSerialNumber;
  if (req.files['videoUrl']) {
    film.duration = resultDuration;
    film.videoUrl = infoVideo;
  }
  film.seriesId = req.params.seriesId;
  await film.save();

  res.status(201).json({
    success: true,
    data: film,
    message: `Cập nhật phim thành công.`,
  });
});

exports.postCheckSeriesNumber = AsyncHandler(async (req, res, next) => {
  let film;

  if (req.body.type === 'update') {
    film = await FilmForSeries.find({
      seriesId: req.params.seriesId,
      filmSerialNumber: { $ne: req.body.numberUpdate },
    });
  } else {
    film = await FilmForSeries.find({
      seriesId: req.params.seriesId,
    });
  }

  if (film.length > 0) {
    for (let i = 0; i < film.length; i++) {
      if (
        (req.body.number === film[i].filmSerialNumber &&
          req.body.type === 'create') ||
        (req.body.number === film[i].filmSerialNumber &&
          req.body.type === 'update')
      ) {
        return next(
          new ErrorResponse(
            `Tập phim này đã tồn tại, vui lòng nhập số khác!!`,
            401,
          ),
        );
      }
    }
  }

  res.status(201).json({
    success: true,
    version: 1.0,
  });
});

exports.postRecoverFilmForSeries = AsyncHandler(async (req, res, next) => {
  const film = await FilmForSeries.findById(req.body.dataId);

  if (!film) {
    return next(
      new ErrorResponse(`Không tìm thấy id phim ${req.body.dataId}!!`, 401),
    );
  }
  film.isDelete = false;
  await film.save();
  res.status(200).json({
    success: true,
    message: 'Đã thay đổi trạng thái phim thành công',
  });
});

exports.postAddManyFilmForSeries = AsyncHandler(async (req, res, next) => {
  const jsonArray = await csv().fromFile(req.file.path);
  count = 0;
  Promise.all(
    jsonArray.map(async (item, id) => {
      if (
        item.videoId === '' ||
        item.videoUrl === '' ||
        item.filmSerialNumber === '' ||
        item.seriesId === ''
      ) {
        count = id + 1;
        return next(
          new ErrorResponse(
            `Phát hiện lỗi dữ liệu excel ở số dòng ${count}!!`,
            401,
          ),
        );
      }
    }),
  );

  Promise.all(
    jsonArray.map(async (item, id) => {
      await FilmForSeries.create({
        videoUrl: {
          videoId: item.videoId,
          url: item.videoUrl,
        },
        filmSerialNumber: +item.filmSerialNumber,
        createAt: Date.now(),
        seriesId: item.seriesId,
      });
    }),
  );

  await DeleteFile(req.file.path);
  res.status(200).json({
    success: true,
    message: 'Thêm nhiều bộ phim thành công',
  });
});
