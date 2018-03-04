/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

var _ = require('lodash');

/**
 * Applies all transforms to a property. This is a pure function,
 * it returns a new property object rather than mutating it inline.
 * @private
 * @param {Object} property
 * @param {Object} options
 * @returns {Object} - A new property object with transforms applied.
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
      // Only try to transform if the value is not a string or if it has '{}'
      if (transform.type === 'value' && (!_.isString(property.value) || property.value.indexOf('{') < 0))
        to_ret.value = transform.transformer(to_ret, options);
      if (transform.type === 'attribute')
        to_ret.attributes = _.extend({}, to_ret.attributes, transform.transformer(to_ret, options));
    }
  }

  return to_ret;
}


module.exports = transformProperty;
