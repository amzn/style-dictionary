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
import { isPlainObject } from 'is-plain-object';

/**
 * Takes a nested object of tokens and filters them using the provided
 * function.
 *
 * @param {Object|undefined|null} tokens
 * @param {Function} filter - A function that receives a property object and
 *   returns `true` if the property should be included in the output or `false`
 *   if the property should be excluded from the output.
 * @returns {Object[]} tokens - A new object containing only the tokens
 *   that matched the filter.
 */
function filterTokenObject(tokens, filter) {
  // Use reduce to generate a new object with the unwanted tokens filtered
  // out
  return Object.entries(tokens ?? []).reduce((acc, [key, value]) => {
    // If the value is not an object, we don't know what it is. We return it as-is.
    if (!isPlainObject(value)) {
      return acc;
      // If the value has a `value` member we know it's a property, pass it to
      // the filter function and either include it in the final `acc` object or
      // exclude it (by returning the `acc` object without it added).
    } else if (typeof value.value !== 'undefined') {
      return filter(value) ? { ...acc, [key]: value } : acc;
      // If we got here we have an object that is not a property. We'll assume
      // it's an object containing multiple tokens and recursively filter it
      // using the `filterTokenObject` function.
    } else {
      const filtered = filterTokenObject(value, filter);
      // If the filtered object is not empty then add it to the final `acc`
      // object. If it is empty then every property inside of it was filtered
      // out, then exclude it entirely from the final `acc` object.
      return Object.entries(filtered || {}).length < 1 ? acc : { ...acc, [key]: filtered };
    }
  }, {});
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
    if (typeof filter !== 'function') {
      throw new Error('filter is not a function');
    } else {
      return {
        allTokens: (dictionary.allTokens ?? []).filter(filter),
        tokens: filterTokenObject(dictionary.tokens, filter),
      };
    }
  }
}
