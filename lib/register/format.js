/**
 * Add a custom format to the style property builder
 * @memberOf styleBuilder
 * @param {Object} options
 * @param {String} options.name
 * @param {Function} options.formatter
 * @returns styleBuilder object
 */
function registerFormat(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (typeof options.formatter !== 'function')
    throw new Error('format formatter must be a function');

  this.format[options.name] = options.formatter;
  return this;
}

module.exports = registerFormat;