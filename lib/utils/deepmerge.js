import _deepmerge from '@bundled-es-modules/deepmerge';
import { isPlainObject } from 'is-plain-object';

/**
 * Wrapper around deepmerge that merges only plain objects and arrays
 * @param {Object} target
 * @param {Object} source
 */
export const deepmerge = (target, source) => {
  return _deepmerge(target, source, {
    // Merge if object is array or a plain object (so not merging functions/class instances together)
    isMergeableObject: (obj) => Array.isArray(obj) || isPlainObject(obj),
    // Combine arrays but remove duplicate primitives (e.g. no duplicate transforms)
    arrayMerge: (target, source) => Array.from(new Set([...target, ...source])),
  });
};
