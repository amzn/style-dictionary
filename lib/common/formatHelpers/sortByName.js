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
 * @typedef {import("../../../types/DesignToken.ts").TransformedToken} Token
 */

/**
 * A sorting function to be used when iterating over `dictionary.allTokens` in
 * a format.
 * @memberof module:formatHelpers
 * @name sortByName
 * @example
 * ```javascript
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   format: function({ dictionary, options }) {
 *     return dictionary.allTokens.sort(sortByName)
 *       .map(token => `${token.name} = ${token.value}`)
 *       .join('\n');
 *   }
 * });
 * ```
 * @param {Token} a - first element for comparison
 * @param {Token} b - second element for comparison
 * @returns {number} -1 or 1 depending on which element should come first based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
export default function sortByName(a, b) {
  if (b.name > a.name) {
    return -1;
  } else {
    return 1;
  }
}
