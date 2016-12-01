var _ = require('lodash'),
    transformProperty = require('./property'),
    propertySetup = require('./propertySetup');

/**
 * Applies transforms on all properties. This
 * does not happen inline, rather it is functional
 * and returns a new object. We need to do this
 * so we can perform transforms for different platforms
 * on the same style dictionary.
 * @param {Object} obj
 * @param {Object} options
 * @param {Array} [path=[]]
 * @param {Object} [to_ret={}]
 * @returns {Object}
 */
function transformObject(obj, options, path, to_ret) {
  to_ret = to_ret || {};
  path = path || [];

  for(var name in obj) {
    if (obj.hasOwnProperty(name)) {
      path.push(name);
      // Need better logic
      if (_.isPlainObject(obj[name]) && !_.has(obj[name], 'value')) {
        to_ret[name] = transformObject(obj[name], options, path, to_ret[name]);
      } else {
        to_ret[name] = transformProperty(
          propertySetup(obj[name], name, path),
          options
        );
      }
      path.pop();
    }
  }

  return to_ret;
}


module.exports = transformObject;