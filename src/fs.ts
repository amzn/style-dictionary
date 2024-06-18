import memfs from '@bundled-es-modules/memfs';
import type { Volume } from './types';

/**
 * Allow to be overridden by setter, set default to memfs for browser env, node:fs for node env
 */
export let fs: Volume = memfs;

/**
 * since ES modules exports are read-only, use a setter
 * @param {Volume} _fs
 * @param {boolean} [isNodeFS]
 */
/* c8 ignore next 3 */
export const setFs = (_fs: Volume, isNodeFS = false) => {
  fs = _fs;
  if (!isNodeFS) {
    fs.__custom_fs__ = true;
  }
};
