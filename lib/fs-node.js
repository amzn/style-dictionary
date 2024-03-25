import _fs from 'node:fs';
import { setFs as _setFs, fs } from './fs.js';

_setFs(_fs, true);

/**
 * @param {import('../types/Volume.d.ts').Volume} v
 */
const setFs = (v) => {
  // TODO: add a custom test process that tests NodeJS env with memfs FS shim,
  // SD volume option is already tested
  if (v !== _fs) {
    v.__custom_fs__ = true;
  }
  _setFs(v);
};

export { fs, setFs };
