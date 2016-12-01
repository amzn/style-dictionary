var flattenProperties = require('./utils/flattenProperties'),
    resolveObject = require('./utils/resolveObject'),
    transformObject = require('./transform/object'),
    transformConfig = require('./transform/config'),
    buildFiles = require('./buildFiles'),
    performActions = require('./performActions');

/**
 * Takes a platform and performs all transforms to
 * the properties object (non-mutative) then
 * builds all the files and performs any actions.
 * @memberOf StyleDictionary
 * @param {Object} platform
 * @returns {StyleDictionary}
 */
function buildPlatform(platform) {
  var properties;
  // We don't want to mutate the original object
  var platformConfig = transformConfig(this.options.platforms[platform], this);

  // We need to transform the object before we resolve the
  // variable names because if a value contains concatenated
  // values like "1px solid {color.border.base}" we want to
  // transform the original value (color.border.base) before
  // replacing that value in the string.
  properties = resolveObject(
    transformObject(this.properties, platformConfig)
  );

  // This is the dictionary object we pass to the file
  // building and action methods.
  var dictionary = {
    properties: properties,
    allProperties: flattenProperties( properties )
  };

  buildFiles(dictionary, platformConfig);
  performActions(dictionary, platformConfig);

  // For chaining
  return this;
}


module.exports = buildPlatform;