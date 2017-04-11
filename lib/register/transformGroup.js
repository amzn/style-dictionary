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
 * Add a custom transformGroup to the styleBuilder, which is a
 * group of transforms.
 * @memberOf styleBuilder
 * @param {Object} options
 * @param {String} options.name
 * @param {String[]} options.transforms
 */
function registerTransformGroup(options) {
  if (typeof options.name !== 'string')
    throw new Error('transform name must be a string');
  if (!_.isArray(options.transforms))
    throw new Error('transforms must be an array of registered value transforms');

  options.transforms.forEach((function(t) {
    if (!_.has(this.transform, t))
      throw new Error('transforms must be an array of registered value transforms');
  }).bind(this));

  this.transformGroup[options.name] = options.transforms;
  return this;
}


module.exports = registerTransformGroup;
