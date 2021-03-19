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
 * Add a custom file header to the style dictionary. File headers are used in
 * formats to display some information about how the file was built in a comment.
 * @static
 * @memberof module:style-dictionary
 * @param {Object} options
 * @param {String} options.name - Name of the format to be referenced in your config.json
 * @param {function} options.fileHeader - Function that returns an array of strings, which will be mapped to comment lines. It takes a single argument which is the default message array. See [file headers](formats.md#file-headers) for more information.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerFileHeader({
 *   name: 'myCustomHeader',
 *   fileHeader: function(defaultMessage) {
 *     return [
 *       ...defaultMessage,
 *       `hello, world!`
 *     ];
 *   }
 * })
 * ```
 */

function registerFileHeader(options) {
  if (typeof options.name !== 'string')
    throw new Error('Can\'t register file header; options.name must be a string');
  if (typeof options.fileHeader !== 'function')
    throw new Error('Can\'t register file header; options.fileHeader must be a function');

  this.fileHeader[options.name] = options.fileHeader;

  return this;
}

module.exports = registerFileHeader;
