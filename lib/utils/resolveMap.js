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
import createReferenceRegex from './references/createReferenceRegex.js';
import { _resolveReferences } from './references/resolveReferencesMap.js';
import usesReferences from './references/usesReferences.js';

/**
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../types/Config.d.ts').RegexOptions} RegexOptions
 * @typedef {RegexOptions & {ignorePaths?: Set<string>; ignoreKeys?: Set<string>; usesDtcg?: boolean }} Options
 */

const defaults = {
  // attributes get added by transforms, and should not be resolved, otherwise it only works for transitive transform/resolve cycles
  ignoreKeys: new Set(['original', 'key', 'path', 'attributes']),
  // we're in transform hook phase, we collect warnings and throw a grouped error later
  warnImmediately: false,
};

/**
 *
 * @param {Map<string, TransformedToken>} tokenMap
 * @param {Options} _opts
 * @returns
 */
export function resolveMap(tokenMap, _opts) {
  /** @type {Record<string, boolean>} */
  const foundCirc = {};
  let { ignoreKeys } = defaults;
  if (_opts && _opts.ignoreKeys instanceof Set) {
    ignoreKeys = ignoreKeys.union(_opts.ignoreKeys);
  }
  const opts = { ...defaults, ..._opts, ignoreKeys };
  const current_context = '';
  // Note: we might need to create a clone of the tokenMap
  opts.regex = createReferenceRegex({ capture_groups: true, ...opts });
  for (const [key, token] of Array.from(tokenMap)) {
    const resolved = traverseObj(token, tokenMap, opts, current_context, foundCirc);
    tokenMap.set(key, resolved);
  }
}

/**
 * This has to traverse objects in case the token property (e.g. .value) is an object
 *
 * @param {TransformedToken} slice - slice within the full object
 * @param {Map<string, TransformedToken>} tokenMap
 * @param {Options} opts - options such as regex, ignoreKeys, ignorePaths, etc.
 * @param {string} current_context - keeping track of the token group context that we're in
 * @param {Record<string, boolean>} foundCirc
 */
function traverseObj(slice, tokenMap, opts, current_context, foundCirc) {
  for (const key in slice) {
    if (!Object.hasOwn(slice, key)) {
      continue;
    }
    const prop = slice[key];

    // We want to check for ignoredKeys, this is to
    // skip over attributes that should not be
    // mutated, like a copy of the original or key property.
    // Note: we only check this for traversal depth === 1
    // after that, we're already inside the token.($)value and keys should not be skipped
    if (opts.ignoreKeys && opts.ignoreKeys.has(key)) {
      continue;
    }

    current_context = /** @type {string} */ (slice.key);
    if (typeof prop === 'object') {
      traverseObj(prop, tokenMap, opts, current_context, foundCirc);
    } else if (typeof prop === 'string') {
      if (usesReferences(prop)) {
        const ref = _resolveReferences(prop, tokenMap, {
          ...opts,
          current_context,
          foundCirc,
        });
        if (ref !== undefined) {
          /** @type {any} */ (slice[key]) = ref;
        }
      }
    }
    current_context = '';
  }

  return slice;
}
