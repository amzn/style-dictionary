import memfs from '@bundled-es-modules/memfs';

/**
 * @typedef {import('../types/Volume.d.ts').Volume} Volume
 */

/**
 * Allow to be overridden by setter, set default to memfs for browser env, node:fs for node env
 * Default CJS export when converted to ESM, messes up the types a bit so we need to
 * cast the default import to type of Volume by first casting to unknown...
 */
export let fs = /** @type {Volume} */ (/** @type {unknown} */ (memfs));

/**
 * since ES modules exports are read-only, use a setter
 * @param {Volume} _fs
 * @param {boolean} [isNodeFS]
 */
/* c8 ignore next 3 */
export const setFs = (_fs, isNodeFS = false) => {
  fs = _fs;
  if (!isNodeFS) {
    fs.__custom_fs__ = true;
  }
};
