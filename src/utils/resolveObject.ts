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
import type { TransformedTokens } from '../types';
import createReferenceRegex from './references/createReferenceRegex';
import { _resolveReferences } from './references/resolveReferences';

/**
 * @typedef {import('../../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {import('../../types/DesignToken.d.ts').TransformedToken} TransformedToken
 * @typedef {import('../../types/Config.d.ts').RegexOptions} RegexOptions
 * @typedef {RegexOptions & {ignorePaths?: string[]; ignoreKeys?: string[]; usesDtcg?: boolean }} Options
 */

const defaults = {
  ignoreKeys: ['original'],
};

interface Options {
  ignoreKeys?: string[];
  ignorePaths?: string[];
  usesDtcg?: boolean;
  regex?: RegExp;
  current_context?: string[];
  foundCirc?: Record<string, boolean>;
}

/**
 *
 * @param {TransformedTokens} object
 * @param {Options} _opts
 * @returns
 */
export default function resolveObject(object: TransformedTokens, _opts: Options = {}) {
  const foundCirc: Record<string, boolean> = {};
  const opts = { ...defaults, ..._opts };
  const current_context: string[] = [];
  const clone = structuredClone(object); // This object will be edited
  opts.regex = createReferenceRegex(opts);

  if (typeof object === 'object') {
    return traverseObj(clone, clone, opts, current_context, foundCirc);
  } else {
    throw new Error('Please pass an object in');
  }
}

/**
 * @param {TransformedTokens} slice - slice within the full object
 * @param {TransformedTokens} fullObj - the full object
 * @param {Options} opts - options such as regex, ignoreKeys, ignorePaths, etc.
 * @param {string[]} current_context - keeping track of the token group context that we're in
 * @param {Record<string, boolean>} foundCirc
 */
function traverseObj(
  slice: TransformedTokens,
  fullObj: TransformedTokens,
  opts: Options,
  current_context: string[],
  foundCirc: Record<string, boolean>,
) {
  for (const key in slice) {
    if (!Object.hasOwn(slice, key)) {
      continue;
    }
    const prop = slice[key];

    // We want to check for ignoredKeys, this is to
    // skip over attributes that should not be
    // mutated, like a copy of the original property.
    if (opts.ignoreKeys && opts.ignoreKeys.indexOf(key) !== -1) {
      continue;
    }

    current_context.push(key);
    if (typeof prop === 'object') {
      traverseObj(prop, fullObj, opts, current_context, foundCirc);
    } else if (typeof prop === 'string') {
      if ((prop as string).indexOf('{') > -1) {
        const ref = _resolveReferences(prop, fullObj, {
          ...opts,
          // we're in transform hook phase, we collect warnings and throw a grouped error later
          warnImmediately: false,
          current_context,
          foundCirc,
        });
        if (ref !== undefined) {
          // TODO fix this
          // @ts-expect-error
          slice[key] = ref;
        }
      }
    }
    current_context.pop();
  }

  return fullObj;
}
