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
 * @typedef {import('../../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {{strip?: string[]; keep?: string[]; usesDtcg?: boolean;}} StripMetaOptions
 */

/**
 * @param {TransformedTokens} obj
 * @param {StripMetaOptions} options
 */
export function _stripMeta(obj, options) {
  const { strip, keep, usesDtcg } = options;
  Object.keys(obj).forEach((key) => {
    if (Object.hasOwn(obj, usesDtcg ? '$value' : 'value')) {
      if (strip && strip.includes(key)) {
        delete obj[key];
      }

      if (keep && !keep.includes(key)) {
        delete obj[key];
      }
    }

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      _stripMeta(obj[key], options);
    }
  });

  return obj;
}

/**
 * @param {TransformedTokens} obj
 * @param {StripMetaOptions} options
 */
export function stripMeta(obj, options) {
  const clone = structuredClone(obj);
  return _stripMeta(clone, options);
}
