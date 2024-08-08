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

import tokenSetup from './tokenSetup.js';
import transformToken from './token.js';
import usesReferences from '../utils/references/usesReferences.js';

/**
 * @typedef {import('../../types/DesignToken.d.ts').DesignToken} DesignToken
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Config.d.ts').Config} Config
 * @typedef {import('../../types/Volume.d.ts').Volume} Volume
 */

/**
 * @param {Map<string, DesignToken>} tokenMap
 * @param {PlatformConfig} config
 * @param {Config} options
 * @param {{ transformedPropRefs?: string[]; deferredPropValueTransforms?: string[] }} [ctx]
 * @param {Volume} [volume]
 *
 * @return {Promise<Map<string, TransformedToken>>}
 */
export async function transformMap(
  tokenMap,
  config,
  options,
  { transformedPropRefs = [], deferredPropValueTransforms = [] } = {},
  volume,
) {
  /**
   * @param {string} key
   */
  const deferProp = (key) => {
    // If property path isn't in the deferred array, add it now.
    if (deferredPropValueTransforms.indexOf(key) === -1) {
      deferredPropValueTransforms.push(key);
    }
  };

  /** @type {Promise<{token: TransformedToken|undefined; key: string}>[]} */
  const transformPromises = [];

  /**
   * @param {TransformedToken} token
   * @param {string} key
   */
  const transformTokenFn = async (token, key) => {
    const transformedToken = await transformToken(token, config, options, volume);
    if (transformedToken === undefined) {
      deferProp(key);
    }
    return { token: transformedToken, key };
  };

  for (const [key, _token] of Array.from(tokenMap)) {
    const alreadyTransformed = transformedPropRefs.indexOf(key) !== -1;
    if (alreadyTransformed) {
      continue;
    }
    const nameParts = key.replace('{', '').replace('}', '').split('.');
    const token = tokenSetup(
      _token,
      // this is how it used to work in transformObject, we took the closest parent group key
      nameParts[nameParts.length - 1],
      nameParts,
    );
    // If property has a reference, defer its transformations until later
    if (usesReferences(options.usesDtcg ? token.$value : token.value, config)) {
      deferProp(key);
      continue;
    }

    transformPromises.push(transformTokenFn(token, key));
  }

  const transformedTokens = (await Promise.all(transformPromises)).filter(
    (t) => t.token !== undefined,
  );
  for (const { token, key } of transformedTokens) {
    if (token) {
      tokenMap.set(key, token);
    }

    for (let i = deferredPropValueTransforms.length - 1; i >= 0; i--) {
      if (deferredPropValueTransforms[i] === key) {
        // Important to use .splice and mutate the original array all the way up
        deferredPropValueTransforms.splice(i, 1);
      }
    }

    // Add the property path to the transformed list so we don't transform it again.
    transformedPropRefs.push(key);
  }

  return /** @type {Map<string, TransformedToken>} */ (tokenMap);
}
