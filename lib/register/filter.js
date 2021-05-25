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

/**
 * Add a custom filter to the style dictionary
 * @static
 * @memberof module:style-dictionary
 * @param {Object} filter
 * @param {String} filter.name - Name of the filter to be referenced in your config.json
 * @param {Function} filter.matcher - Matcher function, return boolean if the token should be included.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerFilter({
 *   name: 'isColor',
 *   matcher: function(token) {
  *     return token.attributes.category === 'color';
  *   }
 * })
 * ```
 */
function registerFilter(options) {
  if (typeof options.name !== 'string')
    throw new Error('Can\'t register filter; filter.name must be a string');
  if (typeof options.matcher !== 'function')
    throw new Error('Can\'t register filter; filter.matcher must be a function');

  this.filter[options.name] = options.matcher;

  return this;
}

module.exports = registerFilter;
