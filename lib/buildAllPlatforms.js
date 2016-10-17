var _ = require('lodash'),
    buildFile = require('./buildFile');

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

  // Build a JSON file of all the properties for easy downstream consumption
  buildFile('properties.json', this.format.json, {buildPath: this.defaultBuildPath}, {properties: this.properties});
  
  // For chaining
  return this;
}


module.exports = buildAllPlatforms;