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
import usesReferences from '../utils/references/usesReferences.js';
import getName from '../utils/references/getName.js';
import transformToken from './token.js';
import tokenSetup from './tokenSetup.js';

/**
 * @typedef {import('../../types/Volume.d.ts').Volume} Volume
 * @typedef {import('../../types/DesignToken.d.ts').PreprocessedTokens} Tokens
 * @typedef {import('../../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {import('../../types/DesignToken.d.ts').DesignToken} Token
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Config.d.ts').Config} Config
 */

/**
 * Applies transforms on all tokens. This
 * does not happen inline, rather it is functional
 * and returns a new object. By doing this,
 * we can perform transforms for different platforms
 * on the same style dictionary.
 * @private
 * @param {Tokens|TransformedTokens} obj
 * @param {PlatformConfig} config
 * @param {Config} options
 * @param {{ transformedPropRefs?: string[], deferredPropValueTransforms?: string[] }} [ctx]
 * @param {string[]} [path]
 * @param {Record<string, Tokens|TransformedTokens|Token|TransformedToken>} [transformedObj]
 * @param {Volume} [volume]
 * @returns {Promise<TransformedTokens>}
 */
export default async function transformObject(
  obj,
  config,
  options,
  { transformedPropRefs = [], deferredPropValueTransforms = [] } = {},
  path = [],
  transformedObj = {},
  volume,
) {
  for (const name in obj) {
    if (!Object.hasOwn(obj, name)) {
      continue;
    }

    path.push(name);
    const objProp = obj[name];
    const isObj = isPlainObject(objProp);

    // is the objProp a style property?
    // {
    //   value: "#ababab"
    //   ...
    // }
    if (isObj && Object.hasOwn(objProp, `${options.usesDtcg ? '$' : ''}value`)) {
      const pathName = getName(path);
      const alreadyTransformed = transformedPropRefs.indexOf(pathName) !== -1;

      // If the property is already transformed, just pass assign it to the
      // transformed object and move on.
      if (alreadyTransformed) {
        transformedObj[name] = /** @type {Token|TransformedToken} */ (objProp);
        path.pop();
        continue;
      }

      // Note: tokenSetup won't re-run if property has already been setup
      // it is safe to run this multiple times on the same property.
      const token = tokenSetup(/** @type {Token|TransformedToken} */ (objProp), name, path);

      const deferProp = () => {
        // If property path isn't in the deferred array, add it now.
        if (deferredPropValueTransforms.indexOf(pathName) === -1) {
          deferredPropValueTransforms.push(pathName);
        }
        transformedObj[name] = token;
        path.pop();
      };

      // If property has a reference, defer its transformations until later
      if (usesReferences(options.usesDtcg ? token.$value : token.value, config)) {
        deferProp();
        continue;
      }

      // If we got here, the property hasn't been transformed yet and
      // does not use a value reference. Transform the property now and assign it.
      const transformedToken = await transformToken(token, config, options, volume);
      // If a value transform returns undefined, it means the transform wants it to be deferred
      // e.g. due to a ref existing in a sibling prop that the transform relies on.
      // Example: { value: "#fff", darken: "{darken-amount}" }
      if (transformedToken === undefined) {
        deferProp();
        continue;
      }

      transformedObj[name] = transformedToken;

      // Remove the property path from the deferred transform list, starting from end of array
      for (let i = deferredPropValueTransforms.length - 1; i >= 0; i--) {
        if (deferredPropValueTransforms[i] === pathName) {
          // Important to use .splice and mutate the original array all the way up
          deferredPropValueTransforms.splice(i, 1);
        }
      }

      // Add the property path to the transformed list so we don't transform it again.
      transformedPropRefs.push(pathName);
    } else if (isObj) {
      // objProp is not a token -> go deeper down the object tree
      transformedObj[name] = await transformObject(
        objProp,
        config,
        options,
        { transformedPropRefs, deferredPropValueTransforms },
        path,
        transformedObj[name],
        volume,
      );
    } else {
      // objProp is not a token or an object then it is some other data in the
      // object we should just copy over. There might be metadata
      // like documentation in the object that is not part of a token/property.
      transformedObj[name] = objProp;
    }

    path.pop();
  }

  return transformedObj;
}
