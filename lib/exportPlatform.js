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

var resolveObject   = require('./utils/resolveObject'),
    transformObject = require('./transform/object'),
    transformConfig = require('./transform/config');

/**
 * Exports a properties object with applied
 * platform transforms.
 *
 * This is useful if you want to use a style
 * dictionary in JS build tools like webpack.
 *
 * @static
 * @memberof module:style-dictionary
 * @param {String} platform - The platform to be exported.
 * Must be defined on the style dictionary.
 * @returns {Object}
 */
function exportPlatform(platform) {
  if (!platform || !this.options.platforms[platform]) {
    throw new Error('Please supply a valid platform');
  }

  // We don't want to mutate the original object
  var platformConfig = transformConfig(this.options.platforms[platform], this);

  // We need to transform the object before we resolve the
  // variable names because if a value contains concatenated
  // values like "1px solid {color.border.base}" we want to
  // transform the original value (color.border.base) before
  // replacing that value in the string.
  return resolveObject(
    transformObject(this.properties, platformConfig)
  );
}


module.exports = exportPlatform;
