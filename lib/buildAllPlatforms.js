var _ = require('lodash');

/**
 * The only top-level method that needs to be called
 * to build the Style Dictionary.
 * @memberOf StyleDictionary
 * @returns {StyleDictionary}
 */
function buildAllPlatforms() {
  var self = this;

  _.forIn(this.options.platforms, function (platform, key) {
    self.buildPlatform(key);
  });
  
  // For chaining
  return this;
}


module.exports = buildAllPlatforms;