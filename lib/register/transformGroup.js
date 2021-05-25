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

var _ = require('../utils/es6_');

/**
 * Add a custom transformGroup to the Style Dictionary, which is a
 * group of transforms.
 * @static
 * @memberof module:style-dictionary
 * @param {Object} transformGroup
 * @param {String} transformGroup.name - Name of the transform group that will be referenced in config.json
 * @param {String[]} transformGroup.transforms - Array of strings that reference the name of transforms to be applied in order. Transforms must be defined and match the name or there will be an error at build time.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerTransformGroup({
 *   name: 'Swift',
 *   transforms: [
 *     'attribute/cti',
 *     'size/pt',
 *     'name/cti'
 *   ]
 * });
 * ```
 */
function registerTransformGroup(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (!_.isArray(options.transforms))
    throw new Error('transforms must be an array of registered value transforms');

  options.transforms.forEach((function(t) {
    if (!(t in this.transform))
      throw new Error('transforms must be an array of registered value transforms');
  }).bind(this));

  this.transformGroup[options.name] = options.transforms;
  return this;
}


module.exports = registerTransformGroup;
