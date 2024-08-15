const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg'
    ) {
      cb(null, 'src/images');
    } else if (file.mimetype === 'video/mp4') {
      cb(null, 'src/videos');
    } else {
      cb(new Error('Unsupported file type'), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'imageUrl' },
  { name: 'videoUrl' },
]);

module.exports = {
  upload,
};
