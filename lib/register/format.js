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
 * Add a custom format to the style dictionary
 * @static
 * @memberof module:style-dictionary
 * @param {Object} format
 * @param {String} format.name - Name of the format to be referenced in your config.json
 * @param {Function} format.formatter - Function to perform the format. Takes 2 arguments, `dictionary` and `config`
 * Must return a string. Function is bound to its file object in the `platform.files` array.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'json',
 *   formatter: function(dictionary, config) {
 *     return JSON.stringify(dictionary.properties, null, 2);
 *   }
 * })
 * ```
 */
function registerFormat(options) {
  if (typeof options.name !== 'string')
    throw new Error('Can\'t register format; format.name must be a string');
  if (typeof options.formatter !== 'function')
    throw new Error('Can\'t register format; format.formatter must be a function');

  this.format[options.name] = options.formatter;

  return this;
}

module.exports = registerFormat;
