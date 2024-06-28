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
import _deepmerge from '@bundled-es-modules/deepmerge';
import isPlainObject from 'is-plain-obj';

/**
 * Wrapper around deepmerge that merges only plain objects and arrays
 * @param {Object} target
 * @param {Object} source
 * @param {boolean} [dedupeArrays]
 */
export const deepmerge = (target, source, dedupeArrays = true) => {
  return _deepmerge(target, source, {
    /**
     * Merge if object is array or a plain object (so not merging functions/class instances together)
     * @param {Object} obj
     */
    isMergeableObject: (obj) => Array.isArray(obj) || isPlainObject(obj),
    /**
     * Combine arrays but remove duplicate primitives (e.g. no duplicate transforms)
     * @param {Array<unknown>} target
     * @param {Array<unknown>} source
     */
    arrayMerge: (target, source) => {
      return dedupeArrays && target.length > 0 && source.length > 0
        ? // if both arrays have values, dedupe them
          Array.from(new Set([...target, ...source]))
        : [...target, ...source];
    },
  });
};
