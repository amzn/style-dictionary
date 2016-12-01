var _ = require('lodash');


/**
 * Add a custom transformGroup to the styleBuilder, which is a
 * group of transforms.
 * @memberOf styleBuilder
 * @param {Object} options
 * @param {String} options.name
 * @param {String[]} options.transforms
 */
function registerTransformGroup(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (!_.isArray(options.transforms))
    throw new Error('transforms must be an array of registered value transforms');

  options.transforms.forEach(function(t) {
    if (_.has(this.transforms, t))
      throw new Error('transforms must be an array of registered value transforms');
  });

  this.transformGroup[options.name] = options.transforms;
  return this;
}


module.exports = registerTransformGroup;
