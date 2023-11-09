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

import { reduce, isObject, filter as filterUtil, assign, isEmpty } from './utils/es6_.js';

/**
 * Takes a nested object of tokens and filters them using the provided
 * function.
 *
 * @param {Object} tokens
 * @param {Function} filter - A function that receives a property object and
 *   returns `true` if the property should be included in the output or `false`
 *   if the property should be excluded from the output.
 * @returns {Object[]} tokens - A new object containing only the tokens
 *   that matched the filter.
 */
function filterTokenObject(tokens, filter) {
  // Use reduce to generate a new object with the unwanted tokens filtered
  // out
  return reduce(
    tokens,
    (result, value, key) => {
      // If the value is not an object, we don't know what it is. We return it as-is.
      if (!isObject(value)) {
        return result;
        // If the value has a `value` member we know it's a property, pass it to
        // the filter function and either include it in the final `result` object or
        // exclude it (by returning the `result` object without it added).
      } else if (typeof value.value !== 'undefined') {
        return filter(value) ? assign(result, { [key]: value }) : result;
        // If we got here we have an object that is not a property. We'll assume
        // it's an object containing multiple tokens and recursively filter it
        // using the `filterTokenObject` function.
      } else {
        const filtered = filterTokenObject(value, filter);
        // If the filtered object is not empty then add it to the final `result`
        // object. If it is empty then every property inside of it was filtered
        // out, then exclude it entirely from the final `result` object.
        return isEmpty(filtered) ? result : assign(result, { [key]: filtered });
      }
    },
    {},
  );
}

/**
 * Takes an array of tokens and filters them using the provided function.
 *
 * @param {Object[]} tokens
 * @param {Function} filter - A function that receives a property object and
 *   returns `true` if the property should be included in the output or `false`
 *   if the property should be excluded from the output.
 * @returns {Object[]} tokens - A new array containing only the tokens
 *   that matched the filter.
 */
function filterTokenArray(tokens, filter) {
  // Go lodash!
  return filterUtil(tokens, filter);
}

/**
 * Takes a dictionary and filters the `allTokens` array and the `tokens`
 * object using a function provided by the user.
 *
 * @param {Object} dictionary
 * @param {Function} filter - A function that receives a token object
 *   and returns `true` if the token should be included in the output
 *   or `false` if the token should be excluded from the output
 * @returns {Object} dictionary - A new dictionary containing only the
 *   tokens that matched the filter (or the original dictionary if no filter
 *   function was provided).
 */
export default function filterTokens(dictionary, filter) {
  if (!filter) {
    return dictionary;
  } else {
    return {
      allTokens: filterTokenArray(dictionary.allTokens, filter),
      tokens: filterTokenObject(dictionary.tokens, filter),
    };
  }
}
