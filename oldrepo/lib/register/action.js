/**
 * Add a custom action to the style property builder. Custom
 * actions can do whatever you need, such as: copying files,
 * base64'ing files, running other build scripts, etc.
 *
 * @memberOf StyleDictionary
 * @param {Object} options
 * @param {String} options.name - The name of the action
 * @param {Function} options.action - The action in the form of a function.
 * @returns {StyleDictionary}
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