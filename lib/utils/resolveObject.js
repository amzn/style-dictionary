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
import { resolveReferences } from './references/resolveReferences.js';

const defaults = {
  ignoreKeys: ['original'],
};

export default function resolveObject(object, _opts = {}) {
  const foundCirc = {};
  const opts = { ...defaults, ..._opts };
  const current_context = [];
  const clone = structuredClone(object); // This object will be edited
  opts.regex = createReferenceRegex(opts);

  if (typeof object === 'object') {
    return traverseObj(clone, clone, opts, current_context, foundCirc);
  } else {
    throw new Error('Please pass an object in');
  }
}

/**
 * @param {Object} slice - slice within the full object
 * @param {Object} fullObj - the full object
 * @param {Object} opts - options such as regex, ignoreKeys, ignorePaths, etc.
 * @param {string[]} current_context - keeping track of the token group context that we're in
 */
function traverseObj(slice, fullObj, opts, current_context, foundCirc) {
  for (const key in slice) {
    if (!slice.hasOwnProperty(key)) {
      continue;
    }
    const value = slice[key];

    // We want to check for ignoredKeys, this is to
    // skip over attributes that should not be
    // mutated, like a copy of the original property.
    if (opts.ignoreKeys && opts.ignoreKeys.indexOf(key) !== -1) {
      continue;
    }

    current_context.push(key);
    if (typeof value === 'object') {
      traverseObj(value, fullObj, opts, current_context, foundCirc);
    } else {
      if (typeof value === 'string' && value.indexOf('{') > -1) {
        slice[key] = resolveReferences(value, fullObj, {
          ...opts,
          current_context,
          foundCirc,
        });
      }
    }
    current_context.pop();
  }

  return fullObj;
}
