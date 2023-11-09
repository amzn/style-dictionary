import _fs from 'node:fs';
import { setFs, fs } from './fs.js';

setFs(_fs);

export { fs, setFs };
