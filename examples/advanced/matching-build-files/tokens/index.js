import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const dirs = (p) => readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
export default dirs(import.meta.url);
