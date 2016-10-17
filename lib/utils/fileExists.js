var fs = require('fs-extra');

/**
 * Tests for the existence of a file
 * @param {String} filePath
 * @returns {Boolean}
 */
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

module.exports = fileExists;