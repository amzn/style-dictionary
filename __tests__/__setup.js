import { use } from 'chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { dirname } from 'path-unified';
import { fs } from 'style-dictionary/fs';
import { chaiWtrSnapshot } from '../snapshot-plugin/chai-wtr-snapshot.js';
import { fixDate } from './__helpers.js';

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

function ensureDirectoryExistence(filePath) {
  const dir = dirname(filePath);
  if (fs.existsSync(dir)) {
    return true;
  }
  fs.mkdirSync(dir, { recursive: true });
}

function mirrorFile(file, contents) {
  ensureDirectoryExistence(file);
  fs.writeFileSync(file, contents, 'utf-8');
}

export function setup(filesToMirror) {
  use(chaiAsPromised);
  use(chaiWtrSnapshot);

  filesToMirror.forEach(([file, contents]) => {
    mirrorFile(file, contents);
  });
}
