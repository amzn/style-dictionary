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
 * Adds a custom parser to parse style dictionary files
 * @static
 * @memberof module:style-dictionary
 * @param {Regex} pattern - A file path regular expression to match which files this parser should be be used on. This is similar to how webpack loaders work. `/\.json$/` will match any file ending in '.json', for example.
 * @param {Function} parse - Function to parse the file contents. Takes 1 argument, which is an object with 2 attributes: contents wich is the string of the file contents and filePath. The function should return a plain Javascript object.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerParser({
 *   pattern: /\.json$/,
 *   parse: ({contents, filePath}) => {
 *     return JSON.parse(contents);
 *   }
 * })
 * ```
 */
function registerParser(options) {
  if (!(options.pattern instanceof RegExp))
    throw new Error(`Can't register parser; parser.pattern must be a regular expression`);
  if (typeof options.parse !== 'function')
    throw new Error('Can\'t register parser; parser.parse must be a function');

  this.parsers.push(options);

  return this;
}

module.exports = registerParser;
