/**
 * @typedef {import('memfs').fs} memfs
 * @typedef {import('node:fs')} nodefs
 */

/**
 * Allow to be overridden by setter, set default to memfs for browser env, node:fs for node env
 */
export let fs = /** @type {memfs|nodefs} */ ((await import('@bundled-es-modules/memfs')).default);

/**
 * since ES modules exports are read-only, use a setter
 * @param {memfs|nodefs} _fs
 */
/* c8 ignore next 3 */
export const setFs = (_fs) => {
  fs = _fs;
};
