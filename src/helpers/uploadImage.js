const cloudinary = require('../configs/cloudinary');
const colors = require('colors');

exports.deleteImageCloud = async (id) => {
  try {
    cloudinary.api.delete_resources([id], {
      type: 'upload',
      resource_type: 'image',
    });
  } catch (error) {
    console.log('error delete image'.red, colors.red(error));
  }
};
