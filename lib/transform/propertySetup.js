var _ = require('lodash');


function propertySetup(property, name, path) {
  if (!property && !_.isPlainObject(property))
    throw new Error('Property object must be an object');
  if (!name || !_.isString(name))
    throw new Error('Name must be a string');
  if (!path || !_.isArray(path))
    throw new Error('Path must be an array');

  var to_ret = _.clone(property);

  // Only do this once
  if (!property.original) {
    // Initial property setup
    // Keep the original object properties so we can key off them in the transforms
    to_ret.original = _.clone(property);
    // Copy the name so we can have a base name to transform
    to_ret.name = to_ret.name || name || '';
    // Create an empty attributes object that we can transform on it later
    to_ret.attributes = to_ret.attributes || {};
    // An array of the path down the object tree so we can use it to build readable names
    // like color_font_base
    to_ret.path = _.clone(path);
  }

  return to_ret;
}


module.exports = propertySetup;