const cloudinary = require('../configs/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let resourceType;
    let folderName;
    if (file.mimetype === 'video/mp4') {
      resourceType = 'video';
    } else {
      resourceType = 'image';
    }
    if (file.fieldname === 'imageUrl' || file.fieldname === 'imageUrlBanner') {
      folderName = 'image-webFilm';
    } else {
      folderName = 'image-avatar';
    }
    return {
      resource_type: resourceType,
      folder: resourceType === 'video' ? 'video-webFilm' : folderName,
      allowedFormats:
        resourceType === 'video' ? ['mp4'] : ['jpg', 'png', 'jpeg'],
    };
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'videoTrailerUrl' },
  { name: 'imageUrl' },
  { name: 'videoUrl' },
  { name: 'imageAvatar' },
]);

module.exports = {
  upload,
};
