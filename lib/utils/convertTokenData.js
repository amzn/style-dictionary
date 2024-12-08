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
import flattenTokens from './flattenTokens.js';

/**
 * @typedef {import('../../types/DesignToken').DesignTokens} DesignTokens
 * @typedef {import('../../types/DesignToken').DesignToken} DesignToken
 * @typedef {import('../../types/DesignToken').TransformedTokens} TransformedTokens
 * @typedef {import('../../types/DesignToken').TransformedToken} TransformedToken
 * @typedef {DesignToken|TransformedToken} Token
 * @typedef {DesignTokens|TransformedTokens} Tokens
 * @typedef {Map<string, Token>} TokenMap
 * @typedef {{'map': TokenMap, 'object': Tokens, 'array': Token[]}} TypeMap
 */

/**
 * @template {Token} T
 * @param {Array<T>} flattenedTokens
 * @returns {Map<string, T>}
 */
function convertToTokenMap(flattenedTokens) {
  return new Map(
    flattenedTokens.map((t) => {
      return [/** @type {string} */ (t.key), t];
    }),
  );
}

/**
 * @param {Token[]} tokenArray
 * @returns
 */
function convertToTokenObject(tokenArray) {
  const obj = /** @type {TransformedTokens} */ ({});
  tokenArray.forEach((token) => {
    const { key } = token;
    const keyArr = /** @type {string} */ (key).replace('{', '').replace('}', '').split('.');
    let slice = obj;
    keyArr.forEach((k, i, arr) => {
      if (slice[k] === undefined) {
        slice[k] = {};
      }
      // end
      if (i === arr.length - 1) {
        slice[k] = token;
      }
      slice = slice[k];
    });
  });
  return obj;
}

/**
 * Allows converting your tokens to one of the 3 data structures available:
 * 'map' -> JavaScript Map
 * 'object' -> JavaScript Object
 * 'array' -> JavaScript Array
 *
 * The input format is automatically detected
 *
 * The return type depends on the "output" prop input, hence the use of a generic / type mapping
 * @template {keyof TypeMap} T
 * @param {Tokens | Token[] | TokenMap} tokens
 * @param {{output: T, usesDtcg?: boolean}} options
 * @return {TypeMap[T]}
 */
export function convertTokenData(tokens, options) {
  const { usesDtcg, output } = options;

  /** @type {keyof TypeMap} */
  const input = Array.isArray(tokens) ? 'array' : tokens instanceof Map ? 'map' : 'object';

  switch (output) {
    case 'array': {
      if (input === 'object') {
        // adds "key" prop
        return /** @type {TypeMap[T]} */ (flattenTokens(/** @type {Tokens} */ (tokens), usesDtcg));
      } else if (input === 'map') {
        // we assume map is always keyed with "key" prop
        return /** @type {TypeMap[T]} */ (
          Array.from(/** @type {TokenMap} */ (tokens)).map(([key, value]) => ({
            key,
            ...value,
          }))
        );
      }
      break;
    }
    case 'map': {
      if (input === 'object') {
        // adds "key" prop
        const flattened = flattenTokens(/** @type {Tokens} */ (tokens), usesDtcg);
        return /** @type {TypeMap[T]} */ (convertToTokenMap(flattened));
      } else if (input === 'array') {
        // we assume that if it's an array, this array was created by flattenTokens which adds the "key" props
        return /** @type {TypeMap[T]} */ (convertToTokenMap(/** @type {Token[]} */ (tokens)));
      }
      break;
    }
    case 'object': {
      if (input === 'map') {
        // we assume map is always keyed with "key" prop
        const arr = Array.from(/** @type {TokenMap} */ (tokens).values());
        return /** @type {TypeMap[T]} */ (convertToTokenObject(arr));
      } else if (input === 'array') {
        // we assume that if it's an array, this array was created by flattenTokens which adds the "key" props
        return /** @type {TypeMap[T]} */ (convertToTokenObject(/** @type {Token[]} */ (tokens)));
      }
      break;
    }
  }
  return /** @type {TypeMap[T]} */ (tokens);
}
