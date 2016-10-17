var transformTypes = ['name', 'value', 'attribute'];

/**
 * Add a custom transform to the styleBuilder
 * Transforms can manipulate a property's name, value, or attributes
 * @memberOf styleBuilder
 * @param {Object} options
 * @param {String} options.type
 * @param {String} options.name Name of the transformer so a transformGroup can call a list of transforms.
 * @param {Function} [options.matcher] Matcher function, return boolean if transform should be applied.
 * @param {Function} options.transformer Performs a transform on a property object, should return a string or object depending on the type. Will only update certain properties so you can't mess up property objects on accident.
 * @returns {Class} StyleProperties
 */
function registerTransform(options) {
  if (typeof options.type !== 'string')
    throw new Error('type must be a string');
  if (transformTypes.indexOf(options.type) < 0)
    throw new Error(options.type + ' type is not one of: ' + transformTypes.join(', '));
  if (typeof options.name !== 'string')
    throw new Error('name must be a string');
  if (options.matcher && typeof options.matcher !== 'function')
    throw new Error('matcher must be a function');
  if (typeof options.transformer !== 'function')
    throw new Error('transformer must be a function');

  this.transform[options.name] = {
    type: options.type,
    matcher: options.matcher,
    transformer: options.transformer
  };

  return this;
}


module.exports = registerTransform;