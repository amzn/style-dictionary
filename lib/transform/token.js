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
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../types/Config.d.ts').PlatformConfig} PlatformConfig
 * @typedef {import('../../types/Transform.d.ts').Transform} Transform
 * @typedef {import('../../types/Transform.d.ts').NameTransform} NameTransform
 */

/**
 * Applies all transforms to a token. This is a pure function,
 * it returns a new token object rather than mutating it inline.
 * @private
 * @param {Token} token
 * @param {PlatformConfig} options
 * @returns {Token} - A new token object with transforms applied.
 */
export default function transformProperty(token, options) {
  const to_ret = structuredClone(token);

  const transforms = /** @type {Omit<Transform, "name">[]} */ (options.transforms) || [];

  for (let i = 0; i < transforms.length; i++) {
    const transform = transforms[i];

    if (!transform.matcher || transform.matcher(to_ret)) {
      if (transform.type === 'name') {
        to_ret.name = /** @type {Omit<NameTransform, "name">} */ (transform).transformer(
          to_ret,
          options,
        );
      }
      // Don't try to transform the value if it is referencing another value
      // Only try to transform if the value is not a string or if it has '{}'
      if (transform.type === 'value' && !usesReferences(token.$value ?? token.value, options)) {
        // Only transform non-referenced values (from original)
        // and transitive transforms if the value has been resolved
        if (!usesReferences(token.original.value, options) || transform.transitive) {
          const newValue = transform.transformer(to_ret, options);
          if (token.$value !== undefined) {
            to_ret.$value = newValue;
          } else {
            to_ret.value = newValue;
          }
        }
      }

      if (transform.type === 'attribute')
        to_ret.attributes = Object.assign(
          {},
          to_ret.attributes,
          transform.transformer(to_ret, options),
        );
    }
  }

  return to_ret;
}
