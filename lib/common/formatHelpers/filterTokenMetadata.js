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
const _ = require('../../utils/es6_');


/**
 * Returns the object which contains only given keys
 * @memberof module:formatHelpers
 * @param {Object} obj - The object to filter. You will most likely pass `dictionary.tokens.color` to it.
 * @param {Array} exceptionKeys - The keys that need to be forced excluded from the filtered object.
 * @param {Array} target - The keys that must be included in the result object.
 * 
 * @returns {Object}
 * @example
 * ```js
 *  StyleDictionary.registerFormat({
 *    name: 'myCustomFormat',
 *    formatter: function ({ dictionary }) {
 *      const originalKeys = getKeys(dictionary.allTokens, 'original');
 *      const filteredJSON = { color: filter(dictionary.tokens.color, 'original', ...originalKeys) };
 *      return JSON.stringify(filteredJSON, null, 2);
 *     }
 *  });
 * ```
 */

const filterTokenMetadata = (obj, isIncludeFilterType = false, ...target) => {
  if (target == null || target.length === 0) return obj;
  if (obj == null || _.isEmpty(obj)) return {};
  target = target.flat(1);
  return Object.fromEntries(
    Object
      .entries(obj)
      .map(([k, v]) => target.includes(k) ? [k, v] : typeof v === 'object' ? [k, filterTokenMetadata(v, isIncludeFilterType, target)] : [k, {}])
      .filter(([k, v]) => v == null ? true : false || _.isEmpty(v) ? false : true)
  )
}

const filterIncludeTokenMetadata = (obj, ...target) => {
  filterTokenMetadata(obj, false, target);
}

module.exports = filterTokenMetadata, filterIncludeTokenMetadata;
