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
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedToken} Token
 * @param {string[]} path
 * @param {Tokens} tokensObj
 * @returns {Token|undefined}
 */
export default function getValueByPath(path, tokensObj) {
  let ref = tokensObj;

  if (!Array.isArray(path)) {
    return;
  }

  for (let i = 0; i < path.length; i++) {
    // Check for undefined as 0 is a valid, truthy value
    if (typeof ref[path[i]] !== 'undefined') {
      ref = ref[path[i]];
    } else {
      // set the reference as undefined if we don't find anything
      return undefined;
    }
  }
  return /** @type {Token} */ (ref);
}
