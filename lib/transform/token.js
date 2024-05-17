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

import usesReferences from '../utils/references/usesReferences.js';

/**
 * @typedef {import('../../types/Volume.d.ts').Volume} Volume
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Config.d.ts').Config} Config
 * @typedef {import('../../types/Transform.d.ts').Transform} Transform
 * @typedef {import('../../types/Transform.d.ts').NameTransform} NameTransform
 */

/**
 * Applies all transforms to a token. This is a pure function,
 * it returns a new token object rather than mutating it inline.
 * @private
 * @param {Token} token
 * @param {PlatformConfig} config
 * @param {Config} options
 * @param {Volume} [vol]
 * @returns {Promise<Token|undefined>} - A new property object with transforms applied.
 */
export default async function transformToken(token, config, options, vol) {
  const to_ret = structuredClone(token);

  const transforms = /** @type {Omit<Transform, "name">[]} */ (config.transforms) || [];

  for (let i = 0; i < transforms.length; i++) {
    const transform = transforms[i];

    if (!transform.filter || transform.filter(to_ret, options)) {
      if (transform.type === 'name') {
        to_ret.name = await /** @type {Omit<NameTransform, "name">} */ (transform).transform(
          to_ret,
          config,
          options,
          vol,
        );
      }
      // Don't try to transform the value if it is referencing another value
      // Only try to transform if the value is not a string or if it has '{}'
      if (
        transform.type === 'value' &&
        !usesReferences(options.usesDtcg ? token.$value : token.value, config)
      ) {
        // Only transform non-referenced values (from original)
        // and transitive transforms if the value has been resolved
        if (
          !usesReferences(
            options.usesDtcg ? token.original.$value : token.original.value,
            config,
          ) ||
          transform.transitive
        ) {
          const transformedValue = await transform.transform(to_ret, config, options, vol);
          if (transformedValue === undefined) {
            return undefined;
          }
          to_ret[options.usesDtcg ? '$value' : 'value'] = transformedValue;
        }
      }

      if (transform.type === 'attribute')
        to_ret.attributes = Object.assign(
          {},
          to_ret.attributes,
          await transform.transform(to_ret, config, options, vol),
        );
    }
  }

  return to_ret;
}
