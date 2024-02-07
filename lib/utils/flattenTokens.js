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
 * @typedef {import('../../types/DesignToken.d.ts').TransformedTokens} Tokens
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} Token
 */

/**
 * @private
 * @param  {Tokens} slice - The plain object you want flattened into an array.
 * @param {boolean} [usesDtcg] - Whether or not tokens are using DTCG syntax.
 * @param  {Token[]} [to_ret] - Tokens array. This function is recursive therefore this is what gets passed along.
 * @return {Token[]}
 */
function _flattenTokens(slice, usesDtcg, to_ret = []) {
  for (let name in slice) {
    if (Object.hasOwn(slice, name)) {
      // TODO: this is a bit fragile and arbitrary to stop when we get to a 'value' property.
      if (isPlainObject(slice[name]) && Object.hasOwn(slice[name], `${usesDtcg ? '$' : ''}value`)) {
        to_ret.push(/** @type {Token} */ (slice[name]));
      } else if (isPlainObject(slice[name])) {
        _flattenTokens(slice[name], usesDtcg, to_ret);
      }
    }
  }
  return to_ret;
}

/**
 * Takes an plain javascript object and will make a flat array of all the leaf nodes.
 * A leaf node in this context has a 'value' property. Potentially refactor this to
 * be more generic.
 * @param  {Tokens} tokens - The plain object you want flattened into an array.
 * @param {boolean} [usesDtcg] - Whether or not tokens are using DTCG syntax.
 * @return {Token[]}
 */
export default function flattenTokens(tokens, usesDtcg = false) {
  return _flattenTokens(tokens, usesDtcg);
}
