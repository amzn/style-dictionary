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
const _ = require("../../utils/es6_");

/**
 * Returns the filtered object. An object can be filtered in two ways: include only the specified keys
 * or exclude them. This is the base function for the `filterIncludeTokenMetadata`
 * and `filterExcludeTokenMetadata` methods, most likely you want to use one of these methods.
 * @memberof module:formatHelpers
 * @param {Object} obj - The object to filter. You will most likely pass `dictionary.tokens.color` to it.
 * @param {Boolean} includeTarget - The type of filter. If true, all keys except the specified ones will
 * be filtered. If false, the specified keys will be excluded.
 * @param {...string} target - The keys that must be included in the result object.
 *
 * @returns {Object}
 * @example
 * ```js
 *  StyleDictionary.registerFormat({
 *    name: 'myCustomFormat',
 *    formatter: function ({ dictionary }) {
 *      const originalKeys = getKeys(dictionary.allTokens, 'original');
 *      const filteredJSON = { color: filterTokenMetadata(dictionary.tokens.color, true, 'original') };
 *      return JSON.stringify(filteredJSON, null, 2);
 *     }
 *  });
 * ```
 */
const filterTokenMetadata = (obj, includeTarget, ...target) => {
  if (target == null || target.length === 0) return obj;
  target = target.flat(1);

  return _.reduce(obj, (result, v, k) => {
      if (target.includes(k)) {
        return includeTarget ? _.assign(result, { [k]: v }) : result;
      }
      if (typeof v === "object" && !Array.isArray(v)) {
        const filtered = filterTokenMetadata(v, includeTarget, target);
        return _.isEmpty(filtered) ? result : _.assign(result, { [k]: filtered });
      }
      return !includeTarget ? _.assign(result, {[k]: v}) : result;
      },{}
  );
};

/**
 * Returns the object which contains only given keys
 * @memberof module:formatHelpers
 * @param {Object} obj - The object to filter. You will most likely pass `dictionary.tokens.color` to it.
 * @param {...string} target - The keys that must be included in the result object.
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
const filterIncludeTokenMetadata = (obj, ...target) => (
  filterTokenMetadata(obj, true, ...target)
);

/**
 * Returns an object that contains all keys except the specified ones
 * @memberof module:formatHelpers
 * @param {Object} obj - The object to filter. You will most likely pass `dictionary.tokens.color` to it.
 * @param {...string} target - The keys that must be excluded from the result object.
 *
 * @returns {Object}
 * @example
 * ```js
 *  StyleDictionary.registerFormat({
 *    name: 'myCustomFormat',
 *    formatter: function ({ dictionary }) {
 *      const originalKeys = getKeys(dictionary.allTokens, 'original');
 *      const filteredJSON = { color: filterExcludeTokenMetadata(dictionary.tokens.color, 'original') };
 *      return JSON.stringify(filteredJSON, null, 2);
 *     }
 *  });
 * ```
 */
const filterExcludeTokenMetadata = (obj, ...target) => (
  filterTokenMetadata(obj, false, ...target)
);

module.exports = {
  filterTokenMetadata,
  filterIncludeTokenMetadata,
  filterExcludeTokenMetadata,
};
