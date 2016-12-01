var _ = require('lodash'),
    buildFile = require('./buildFile');

/**
 * Takes a platform config object and a properties
 * object and builds all the files. Properties object
 * should have been transformed and resolved before this
 * point.
 * @memberOf StyleDictionary
 * @param {Object} dictionary
 * @param {Object} platform
 * @returns {null}
 */
function buildFiles(dictionary, platform) {
  _.each(platform.files, function (file) {
    if (file.template) {
      buildFile(file.destination, file.template.bind(file), platform, dictionary);
    } else if (file.format) {
      buildFile(file.destination, file.format.bind(file), platform, dictionary);
    } else {
      throw new Error('Please supply a template or formatter')
    }
  });
}


module.exports = buildFiles;
