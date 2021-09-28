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

 var _ = require('./es6_');

 /**
 * Remove all private properties that are not for distribution exposure
 * @private
 * @param  {Object} properties - The plain object you want to have removed its private design tokens.
 * @return {Array}
 */
function removePrivateProperties(properties) {
  for (var item in properties) {
    if (properties.hasOwnProperty(item)) {
      if (_.isPlainObject(properties[item]) && properties[item].hasOwnProperty('value')) {
        if (_.isBoolean(properties[item]['private'])) {
          if (properties[item]['private'] === true ) {
            delete properties[item]
          } else {
            delete properties[item]['private']
          }
        }
      } else {
        if (_.isPlainObject(properties[item])) {
          removePrivateProperties(properties[item])
        }
      }
    }
  }

  return properties;
}


module.exports = removePrivateProperties;
