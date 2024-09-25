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
import isPlainObject from 'is-plain-obj';

/**
 * @typedef {import('../types/DesignToken.ts').Dictionary} Dictionary
 * @typedef {import('../types/DesignToken.ts').TransformedTokens} Tokens
 * @typedef {import('../types/DesignToken.ts').TransformedToken} Token
 * @typedef {import('../types/Filter.ts').Filter} Filter
 * @typedef {import('../types/Config.ts').Config} Config
 */

/**
 * @param {Token[]} arr
 * @param {Filter['filter']} predicate
 * @param {Config} options
 */
async function asyncFilter(arr, predicate, options) {
  return Promise.all(arr.map((token) => predicate(token, options))).then((results) =>
    arr.filter((_, index) => results[index]),
  );
}

/**
 * Takes a nested object of tokens and filters them using the provided
 * function.
 *
 * @param {Tokens} tokens
 * @param {Filter['filter']} filter - A function that receives a property object and
 *   returns `true` if the property should be included in the output or `false`
 *   if the property should be excluded from the output.
 * @param {Config} options
 * @returns {Promise<Tokens>} tokens - A new object containing only the tokens
 *   that matched the filter.
 */
async function filterTokenObject(tokens, filter, options) {
  // Use reduce to generate a new object with the unwanted tokens filtered
  // out
  const result = await Object.entries(tokens ?? []).reduce(async (_acc, [key, token]) => {
    const acc = await _acc;
    // If the token is not an object, we don't know what it is. We return it as-is.
    if (!isPlainObject(token)) {
      return acc;
    } else {
      const tokenValue = options.usesDtcg ? token.$value : token.value;
      if (typeof tokenValue === 'undefined') {
        // If we got here we have an object that is not a token. We'll assume
        // it's token group containing multiple tokens and recursively filter it
        // using the `filterTokenObject` function.
        const filtered = await filterTokenObject(token, filter, options);
        // If the filtered object is not empty then add it to the final `acc`
        // object. If it is empty then every token inside of it was filtered
        // out, then exclude it entirely from the final `acc` object.
        return Object.entries(filtered || {}).length < 1 ? acc : { ...acc, [key]: filtered };
      } else {
        // If the token has a `value` member we know it's a token, pass it to
        // the filter function and either include it in the final `acc` object or
        // exclude it (by returning the `acc` object without it added).
        const filtered = await asyncFilter(/** @type {Token[]} */ ([token]), filter, options);
        return filtered.length === 0 ? acc : { ...acc, [key]: token };
      }
    }
  }, {});
  return result;
}

/**
 * Takes a dictionary and filters the `allTokens` array and the `tokens`
 * object using a function provided by the user.
 *
 * @param {Dictionary} dictionary
 * @param {Filter['filter']} [filter] - A function that receives a token object
 *   and returns `true` if the token should be included in the output
 *   or `false` if the token should be excluded from the output
 * @param {Config} [options]
 * @returns {Promise<Dictionary>} dictionary - A new dictionary containing only the
 *   tokens that matched the filter (or the original dictionary if no filter
 *   function was provided).
 */
export default async function filterTokens(dictionary, filter, options = {}) {
  if (!filter) {
    return dictionary;
  } else {
    if (typeof filter !== 'function') {
      throw new Error('filter is not a function');
    } else {
      const allTokens = await asyncFilter(dictionary.allTokens ?? [], filter, options);
      const tokens = await filterTokenObject(dictionary.tokens, filter, options);

      return {
        allTokens,
        tokens,
      };
    }
  }
}
