var _ = require('lodash');

/**
 * Applies all transforms to a property. This is a pure function,
 * it returns a new property object rather than mutating it inline.
 * @param {Object} property
 * @param {Object} options
 * @returns {Object}
 */
function transformProperty(property, options) {
  var to_ret = _.clone(property);
  var transforms = options.transforms;

  for(var i = 0; i < transforms.length; i++ ) {
    var transform = transforms[i];

    if (!transform.matcher || transform.matcher(to_ret)) {
      if (transform.type === 'name')
        to_ret.name = transform.transformer(to_ret, options);
      // Don't try to transform the value if it is referencing another value
      if (transform.type === 'value' && property.value.indexOf('{') < 0)
        to_ret.value = transform.transformer(to_ret, options);
      if (transform.type === 'attribute')
        to_ret.attributes = _.extend({}, to_ret.attributes, transform.transformer(to_ret, options));
    }
  }

  return to_ret;
}


module.exports = transformProperty;