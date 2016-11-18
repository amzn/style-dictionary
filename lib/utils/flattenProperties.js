var _ = require('lodash');
/**
 * Takes an plain javascript object and will make a flat array of all the leaf nodes.
 * A leaf node in this context has a 'value' property. Potentially refactor this to
 * be more generic.
 * @param  {Object} properties - The plain object you want flattened into an array.
 * @param  {Array} [to_ret=[]] - Properties array. This function is recursive so this is what gets passed along.
 * @return {Array}
 */
function flattenProperties(properties, to_ret) {
  to_ret = to_ret || [];

  for(var name in properties) {
    if (properties.hasOwnProperty(name)) {
      // TODO: this is a bit fragile and arbitrary to stop when we get to a 'value' property.
      if (_.isPlainObject(properties[name]) && !_.has(properties[name], 'value')) {
        flattenProperties(properties[name], to_ret);
      } else {
        to_ret.push( properties[name] );
      }
    }
  }

  return to_ret;
}


module.exports = flattenProperties;
