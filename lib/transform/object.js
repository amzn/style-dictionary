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

var _ = require('lodash'),
    transformProperty = require('./property'),
    propertySetup = require('./propertySetup');

/**
 * Applies transforms on all properties. This
 * does not happen inline, rather it is functional
 * and returns a new object. By doing this,
 * we can perform transforms for different platforms
 * on the same style dictionary.
 * @private
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
      if (_.isPlainObject(obj[name]) && ('value' in obj[name])) {
        to_ret[name] = transformProperty(
          propertySetup(obj[name], name, path),
          options
        );
      } else if (_.isPlainObject(obj[name])) {
        to_ret[name] = transformObject(obj[name], options, path, to_ret[name]);
      } else {
        to_ret[name] = obj[name];
      }
      path.pop();
    }
  }

  return to_ret;
}


module.exports = transformObject;
