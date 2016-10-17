var fs = require('fs');

/**
 *
 * @param filePath
 * @returns {String}
 */
function convertToBase64(filePath) {
  if (!filePath || typeof filePath !== 'string')
    throw new Error('filePath name must be a string');

  var body = fs.readFileSync(filePath, 'binary');
  return new Buffer(body, 'binary').toString('base64');
}

module.exports = convertToBase64;