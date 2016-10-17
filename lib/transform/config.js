var _ = require('lodash');

/**
 * Takes a platform config object and returns a new one
 * that has transforms, formats, templates, and actions
 * mapped properly.
 * @param {Object} config
 * @param {Object} dictionary
 * @returns {Object}
 */
function transformConfig(config, dictionary) {
  var to_ret = _.clone(config);

  // The platform can define either a transformGroup or an array
  // of transforms
  var transforms = to_ret.transforms || dictionary.transformGroup[config.transformGroup];

  // Transforms are an array of strings that map to functions on
  // the StyleDictionary module. We need to map the strings to
  // the actual functions.
  to_ret.transforms = _.map(transforms, function(name){
    return dictionary.transform[name];
  });

  to_ret.files = _.map(config.files, function(file){
    if (file.template) {
      return _.extend({}, file, {template: dictionary.template[file.template]});
    } else if (file.format) {
      return _.extend({}, file, {format: dictionary.format[file.format]});
    }
  });

  to_ret.actions = _.map(config.actions, function(action){
    return dictionary.action[action];
  });
  
  // Add the default build path if one is not provided
  if (!to_ret.buildPath) {
    to_ret.buildPath = dictionary.defaultBuildPath;
  }

  return to_ret;
}

module.exports = transformConfig;