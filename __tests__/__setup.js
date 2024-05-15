import { use } from 'chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { dirname } from 'path-unified';
import { fs } from 'style-dictionary/fs';
import { chaiWtrSnapshot } from '../snapshot-plugin/chai-wtr-snapshot.js';
import { fixDate } from './__helpers.js';
import { writeZIP } from '../lib/utils/convertToDTCG.js';

/**
 * We have a bunch of files that we use a mock data for our tests
 * Since we run tests in the browser, we will have to mirror these mock files
 * to the browser-filesystem which uses memfs by default.
 * This will allow the tests to run with the mock files.
 *
 * We also use a custom WTR + Chai snapshot plugin for snapshot testing,
 * which needs to be initialized client-side
 */

fixDate();

let hasInitializedResolve;
export const hasInitialized = new Promise((resolve) => {
  hasInitializedResolve = resolve;
});
// in case of Node env, we can resolve it immediately since we don't do this setup stuff
if (typeof window !== 'object') {
  hasInitializedResolve();
}

/**
 * @param {string} filePath
 */
function ensureDirectoryExists(filePath) {
  const dir = dirname(filePath);
  if (fs.existsSync(dir)) {
    return true;
  }
  fs.mkdirSync(dir, { recursive: true });
}

/**
 * @param {string} file
 * @param {string | Record<string, string>} contents
 */
async function mirrorFile(file, contents) {
  ensureDirectoryExists(file);
  // zip files cannot just be written to FS using utf-8 encoding..
  if (file.endsWith('.zip')) {
    const zipResult = await writeZIP(contents);
    contents = new Uint8Array(await zipResult.arrayBuffer());
  }
  await fs.promises.writeFile(file, contents);
}

/**
 * @param {[string, string | Record<string, string>][]} filesToMirror
 */
export async function setup(filesToMirror) {
  use(chaiAsPromised);
  use(chaiWtrSnapshot);
  await Promise.all(filesToMirror.map(([file, contents]) => mirrorFile(file, contents)));
  hasInitializedResolve();
}
