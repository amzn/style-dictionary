var _ = require('lodash');

function flattenProperties(properties, to_ret) {
  to_ret = to_ret || [];
  
  for(var name in properties) {
    if (properties.hasOwnProperty(name)) {
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