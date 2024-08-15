const path = require('path');
const fs = require('fs');
const colors = require('colors');

module.exports = function DeleteFile(pathUrl) {
  const pathImage = path.join(__dirname, `../../${pathUrl}`);
  fs.unlinkSync(pathImage, (err) => {
    console.log(colors.red(err));
  });
};
