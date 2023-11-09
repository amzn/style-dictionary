import { use } from 'chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import path from '@bundled-es-modules/path-browserify';
import { fs } from 'style-dictionary/fs';
import { chaiWtrSnapshot } from '../snapshot-plugin/chai-wtr-snapshot.js';

/**
 * We have a bunch of files that we use a mock data for our tests
 * Since we run tests in the browser, we will have to mirror these mock files
 * to the browser-filesystem which uses memfs by default.
 * This will allow the tests to run with the mock files.
 *
 * We also use a custom WTR + Chai snapshot plugin for snapshot testing,
 * which needs to be initialized client-side
 */

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
}

function mirrorFile(file, contents) {
  ensureDirectoryExistence(file);
  fs.writeFileSync(file, contents, 'utf-8');
}

export function setup(filesToMirror) {
  use(chaiAsPromised);
  use(chaiWtrSnapshot);

  const constantDate = new Date('2000-01-01');
  // eslint-disable-next-line no-undef
  window.Date = function () {
    return constantDate;
  };
  // eslint-disable-next-line no-undef
  window.Date.now = function () {
    return constantDate;
  };

  filesToMirror.forEach(([file, contents]) => {
    mirrorFile(file, contents);
  });
}
