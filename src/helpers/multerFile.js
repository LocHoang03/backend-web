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

    return {
      resource_type: resourceType,
      folder: resourceType === 'video' ? 'video-handle' : 'image-handle',
      allowedFormats:
        resourceType === 'video' ? ['mp4'] : ['jpg', 'png', 'jpeg'],
    };
  },
});

const uploadFileHandle = multer({ storage: storage }).fields([
  { name: 'file' },
]);

module.exports = {
  uploadFileHandle,
};
