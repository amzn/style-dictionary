import _fs from 'node:fs';
import { setFs as _setFs, fs } from './fs';
import type { Volume } from './types';

_setFs(_fs, true);

const setFs = (v: Volume) => {
  // TODO: add a custom test process that tests NodeJS env with memfs FS shim,
  // SD volume option is already tested
  if (v !== _fs) {
    v.__custom_fs__ = true;
  }
  _setFs(v);
};

export { fs, setFs };
