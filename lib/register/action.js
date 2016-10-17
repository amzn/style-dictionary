/**
 * Add a custom format to the style property builder
 * @memberOf StyleDictionary
 * @param {Object} options
 * @param {String} options.name
 * @param {Function} options.action
 * @returns {StyleDictionary} object
 */
function registerAction(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (typeof options.action !== 'function')
    throw new Error('format formatter must be a function');

  this.action[options.name] = options.action;
  return this;
}

module.exports = registerAction;