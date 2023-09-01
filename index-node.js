import fs from 'node:fs';
import StyleDictionary from './index.js';
import { setFs } from './fs.js';

setFs(fs);

export default StyleDictionary;
