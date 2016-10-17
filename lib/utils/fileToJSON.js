var fs = require('fs-extra');

function fileToJSON(path) {
  return fs.readJsonSync(path);
};

module.exports = fileToJSON;
