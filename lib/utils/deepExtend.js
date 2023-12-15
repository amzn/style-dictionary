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

/**
 * @typedef {import('../../types/DesignToken.d.ts').DesignTokens} Tokens
 * @typedef {import('../../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @typedef {import('../../types/Config.d.ts').Obj} Obj
 */

/**
 * TODO: see if we can use deepmerge instead of maintaining our own utility
 *
 * Performs an deep extend on the objects, from right to left.
 * @private
 * @param {Array<Obj>} objects - An array of JS objects
 * @param {Function} [collision] - A function to be called when a merge collision happens.
 * @param {string[]} [path] - (for internal use) An array of strings which is the current path down the object when this is called recursively.
 * @returns {Obj}
 */
export default function deepExtend(objects, collision, path) {
  if (objects == null) return {};

  let target = objects[0] || {};

  path = path || [];

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object') {
    target = {};
  }

  for (let i = 1; i < objects.length; i++) {
    const options = objects[i];
    // Only deal with non-null/undefined values
    if (options != null) {
      // Extend the base object
      for (const name in options) {
        // Not everything extends from Object in browser context, so bind from Object just in case
        if (!Object.hasOwnProperty.bind(options)(name)) continue;
        if (name === '__proto__') continue;

        const src = target[name];
        const copy = options[name];

        // Prevent never-ending loop
        if (target === copy) {
          continue;
        }

        let copyIsArray = Array.isArray(copy);
        // Recurse if we're merging plain objects or arrays
        if (copy && (isPlainObject(copy) || copyIsArray)) {
          /** @type {Tokens|TransformedTokens|any} */
          let clone;
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          const nextPath = path.slice(0);
          nextPath.push(name);

          // Never move original objects, clone them
          target[name] = deepExtend([clone, copy], collision, nextPath);

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          if (src != null && typeof collision == 'function') {
            collision({ target: target, copy: options, path: path, key: name });
          }
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
