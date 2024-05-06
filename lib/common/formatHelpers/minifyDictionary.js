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
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedTokens} Tokens
 */

/**
 * Outputs an object stripping out everything except values
 * @memberof module:formatHelpers
 * @name minifyDictionary
 * @param {Tokens} obj - The object to minify. You will most likely pass `dictionary.tokens` to it.
 * @param {boolean} [usesDtcg] - Whether or not tokens are using DTCG syntax.
 * @returns {Tokens}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   format: function({ dictionary }) {
 *     return JSON.stringify(minifyDictionary(dictionary.tokens));
 *   }
 * });
 * ```
 */
export default function minifyDictionary(obj, usesDtcg = false) {
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  /** @type {Tokens} */
  const toRet = {};

  if (Object.hasOwn(obj, `${usesDtcg ? '$' : ''}value`)) {
    return usesDtcg ? obj.$value : obj.value;
  } else {
    for (const name in obj) {
      if (Object.hasOwn(obj, name)) {
        toRet[name] = minifyDictionary(obj[name], usesDtcg);
      }
    }
  }
  return toRet;
}
