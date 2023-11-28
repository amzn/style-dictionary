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
 * @typedef {import('../../types/Preprocessor').Preprocessor} Preprocessor
 * Adds a custom preprocessor to preprocess the parsed dictionary, before transforming individual tokens.
 * @static
 * @memberof module:style-dictionary
 * @param {Object} Preprocessor - Preprocessor object
 * @param {String} Preprocessor.name - Name of the format to be referenced in your config.json
 * @param {function} Preprocessor.preprocessor - Function to preprocess the dictionary. The function should return a plain Javascript object.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.registerPreprocessor((dictionary) => {
 *   return dictionary;
 * });
 * ```
 */
export default function registerPreprocessor(cfg) {
  const errorPrefix = 'Cannot register preprocessor;';
  if (typeof cfg.name !== 'string')
    throw new Error(`${errorPrefix} Preprocessor.name must be a string`);
  if (!(cfg.preprocessor instanceof Function)) {
    throw new Error(`${errorPrefix} Preprocessor.preprocessor must be a function`);
  }
  this.preprocessors[cfg.name] = cfg.preprocessor;
  return this;
}
