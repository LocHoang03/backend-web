const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.NAME_CLOUD,
  api_key: process.env.PUBLIC_API_CLOUD,
  api_secret: process.env.SECRET_API_CLOUD,
  secure: true,
});

module.exports = cloudinary;
