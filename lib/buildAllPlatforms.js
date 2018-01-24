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
 * The only top-level method that needs to be called
 * to build the Style Dictionary.
 *
 * @static
 * @memberof module:style-dictionary
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * const StyleDictionary = require('style-dictionary').extend('config.json');
 * StyleDictionary.buildAllPlatforms();
 * ```
 */
function buildAllPlatforms() {
  var self = this;

  _.forIn(this.options.platforms, function (platform, key) {
    self.buildPlatform(key);
  });

  // For chaining
  return this;
}


module.exports = buildAllPlatforms;
