const Series = require('../../../../models/series');

exports.getAllSeries = async (req, res, next) => {
  const series = await Series.find({ isDelete: false }).sort({ createAt: -1 });

  res.status(200).json({
    data: series,
    success: true,
    message: `Get all series successfully.`,
  });
};

exports.getAllSeriesFromPage = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  let count, series;
  if (trash === 'false') {
    count = await Series.find({ isDelete: false }).sort({ createAt: -1 });
    series = await Series.find({ isDelete: false })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  } else {
    count = await Series.find({ isDelete: true }).sort({ createAt: -1 });
    series = await Series.find({ isDelete: true })
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  res.status(200).json({
    data: series,
    success: true,
    count: count.length,
    message: `Get all series successfully.`,
  });
};

exports.getAllSeriesFetchLook = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const trash = req.query.trash;
  const country = req.query.country;
  const name = req.query.name;
  let count, series;
  if (trash === 'false') {
    if (country !== 'All') {
      count = await Series.find({
        isDelete: false,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      series = await Series.find({
        isDelete: false,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      count = await Series.find({
        isDelete: false,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      series = await Series.find({
        isDelete: false,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }
  } else {
    if (country !== 'All') {
      count = await Series.find({
        isDelete: true,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      series = await Series.find({
        isDelete: true,
        country: country,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    } else {
      count = await Series.find({
        isDelete: true,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      }).sort({ createAt: -1 });
      series = await Series.find({
        isDelete: true,
        title: { $regex: `.*${name}.*`, $options: 'i' },
      })
        .sort({ createAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }
  }
  res.status(200).json({
    data: series,
    success: true,
    count: count.length,
    message: `Get all series successfully.`,
  });
};

exports.getNewSeries = async (req, res, next) => {
  const series = await Series.find({ isDelete: false })
    .sort({ createAt: -1 })
    .limit(5);

  res.status(200).json({
    data: series,
    success: true,
    message: `Get five new series successfully.`,
  });
};
