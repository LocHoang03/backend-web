const cloudinary = require('../configs/cloudinary');
const colors = require('colors');

exports.deleteVideoCloud = async (id) => {
  try {
    const results = await cloudinary.api.delete_resources([id], {
      type: 'upload',
      resource_type: 'video',
    });
  } catch (error) {
    console.log('error delete video'.red, colors.red(error));
  }
};
