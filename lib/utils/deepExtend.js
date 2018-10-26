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

const _ = require('lodash');

/**
 * Performs an deep extend on the objects, from right to left.
 * @private
 * @param {Object[]} objects - An array of JS objects
 * @param {Function} collision - A function to be called when a merge collision happens.
 * @param {string[]} path - (for internal use) An array of strings which is the current path down the object when this is called recursively.
 * @returns {Object}
 */
function deepExtend(objects, collision, path = []) {
  if (objects == null) return {};

  let src;
  let copyIsArray;
  let copy;
  let options;
  let clone;
  let target = objects[0] || {};
  const { length } = objects;

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object') {
    target = {};
  }

  const optionsIterator = optionsName => {
    src = target[optionsName];
    copy = options[optionsName];

    // Prevent never-ending loop
    if (target === copy) {
      return;
    }

    // Recurse if we're merging plain objects or arrays
    /* eslint-disable no-cond-assign */
    if (copy && (_.isPlainObject(copy) || (copyIsArray = _.isArray(copy)))) {
      if (copyIsArray) {
        copyIsArray = false;
        clone = src && _.isArray(src) ? src : [];
      } else {
        clone = src && _.isPlainObject(src) ? src : {};
      }

      path.push(optionsName);

      // Never move original objects, clone them
      target[optionsName] = deepExtend([clone, copy], collision, path);

      // Don't bring in undefined values
    } else if (copy !== undefined) {
      if (src != null && typeof collision === 'function') {
        collision({ target, copy: options, path, key: optionsName });
      }
      target[optionsName] = copy;
    }
    path.pop();
  };

  for (let i = 1; i < length; i += 1) {
    options = objects[i];
    // Only deal with non-null/undefined values
    if (options != null) {
      // Extend the base object

      Object.keys(options).forEach(optionsIterator);
    }
  }

  return target;
}

module.exports = deepExtend;
