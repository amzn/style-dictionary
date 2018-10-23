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

const _ = require('lodash');

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
function registerTransformGroup({ name, transforms }) {
  if (typeof name !== 'string') throw new Error('transform name must be a string');
  if (!_.isArray(transforms)) throw new Error('transforms must be an array of registered value transforms');

  transforms.forEach(t => {
    if (!_.has(this.transform, t)) throw new Error('transforms must be an array of registered value transforms');
  });

  this.transformGroup[name] = transforms;
  return this;
}

module.exports = registerTransformGroup;
