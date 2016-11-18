var fs = require('fs');

/**
 *
 * @param {String} filePath - Path to the file you want base64'd
 * @returns {String}
 */
function convertToBase64(filePath) {
  if (!filePath || typeof filePath !== 'string')
    throw new Error('filePath name must be a string');

  var body = fs.readFileSync(filePath, 'binary');
  return new Buffer(body, 'binary').toString('base64');
}

module.exports = convertToBase64;
