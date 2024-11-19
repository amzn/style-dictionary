/**
 * TODO: allow inline snapshots (requires update to @web/test-runner-commands snapshot plugin)
 * TODO: contribute feature to WTR snapshot plugin to allow Javascript complex values as snapshots
 * e.g. with https://www.npmjs.com/package/pretty-format (right now we only escape tildes)
 */

import { isNode } from '../lib/utils/isNode.js';

// Exclude from code coverage since this is just a devtool
/* c8 ignore start */

/**
 * @typedef {import('@types/chai')} Chai
 */

async function blobToDataUrl(blob) {
  let buffer = Buffer.from(await blob.text());
  return 'data:' + blob.type + ';base64,' + buffer.toString('base64');
}

function getTestPath(runnable, index) {
  let path = [];
  let node;
  if (!runnable) {
    return undefined;
  }
  if (runnable.type === 'hook') {
    node = runnable.ctx.currentTest;
  } else {
    node = runnable;
  }

  while (node && node.parent) {
    if (node.title) {
      path.push(node.title);
    }
    node = node.parent;
  }
  path = path.reverse();
  if (Number.isInteger(index)) {
    if (index < 0) {
      throw new Error('Please use positive integers for matchSnapshot calls');
    }
    path.push(index);
  }
  return path.join(' ');
}

let currentTest;
let snapshotStore;
const writeSnapshotsSet = new Set();

/**
 * @type {Chai.ChaiPlugin}
 */
export function chaiWtrSnapshot(chai, utils) {
  /**
   * @param {string} [str]
   */
  function escapeTildes(str) {
    if (typeof str === 'string') {
      return str.replace(/`/g, '\\`');
    }
    return str;
  }

  /**
   * Base HTML snapshot assertion for `assert` interface.
   * @this {Chai.AssertionStatic}
   * @param {string|Node} actual
   * @param {boolean} negate
   */
  async function assertMatchSnapshot(actual, negate, index) {
    const snapshot = escapeTildes(actual);
    let updateSnapshots = false;
    let currentSnapshot;
    let name;
    if (!isNode) {
      // WTR ENV
      const { getSnapshot, getSnapshotConfig } = await import('@web/test-runner-commands');
      name = getTestPath(window.__WTR_MOCHA_RUNNER__.test, index);
      if (!name) {
        return;
      }
      currentSnapshot = await getSnapshot({ name });
      updateSnapshots = (await getSnapshotConfig()).updateSnapshots;
    } else {
      // Node ENV
      name = getTestPath(currentTest, index);
      const snapshotString = await snapshotStore.get(currentTest.file);
      const blob = new Blob([snapshotString], { type: 'text/javascript' });
      const url = await blobToDataUrl(blob);
      currentSnapshot = (await import(url)).snapshots[name];
      // TODO: get --update-snapshots flag
      // updateSnapshots = (await getSnapshotConfig()).updateSnapshots;
    }
    currentSnapshot = escapeTildes(currentSnapshot);

    if (currentSnapshot && !updateSnapshots) {
      if (negate ? currentSnapshot === snapshot : currentSnapshot !== snapshot) {
        throw new chai.AssertionError(
          `Snapshot "${name}" ${negate ? 'matches' : 'does not match'} the saved snapshot on disk`,
          {
            actual: snapshot,
            expected: currentSnapshot,
            showDiff: !negate,
          },
          chai.util.flag(this, 'ssfi'),
        );
      }
    } else if (currentSnapshot !== snapshot) {
      if (!isNode) {
        const { saveSnapshot: saveSnapshotWTR } = await import('@web/test-runner-commands');
        await saveSnapshotWTR({ name, content: snapshot });
      } else {
        const { isSaveSnapshotPayload } = await import('@web/test-runner-commands/plugins');
        const payload = { name, content: snapshot };
        if (!isSaveSnapshotPayload(payload)) {
          throw new Error('Invalid save snapshot payload');
        }
        await snapshotStore.saveSnapshot('session_id_dummy', currentTest.file, name, snapshot);
      }
    }
  }

  /**
   * Snapshot assertion for `should` and `expect` interfaces.
   * @this {Chai.AssertionStatic}
   */
  function matchSnapshot(index) {
    const value = chai.util.flag(this, 'object');
    const negate = utils.flag(this, 'negate');
    return assertMatchSnapshot.call(this, value, negate, index);
  }

  utils.addMethod(chai.Assertion.prototype, 'matchSnapshot', matchSnapshot);

  /** @type {Chai.Assert} */
  chai.assert = {
    matchSnapshot(actualEl) {
      const negate = false;
      return assertMatchSnapshot.call(this, actualEl, negate);
    },
    notMatchSnapshot(actualEl) {
      const negate = true;
      return assertMatchSnapshot.call(this, actualEl, negate);
    },
  };

  if (!isNode) {
    return;
  }

  before(async () => {
    const { SnapshotStore } = await import('@web/test-runner-commands/plugins');
    snapshotStore = new SnapshotStore();
  });

  beforeEach(function () {
    currentTest = this.currentTest;
  });

  afterEach(async function () {
    const { getSnapshotPath } = await import('@web/test-runner-commands/plugins');
    if (
      snapshotStore.snapshots.size > 0 &&
      Array.from(snapshotStore.snapshots).some(([key]) => {
        return key === getSnapshotPath(this.currentTest.file);
      })
    ) {
      writeSnapshotsSet.add(getSnapshotPath(this.currentTest.file));
    }
  });

  after(async () => {
    await Promise.all(
      Array.from(writeSnapshotsSet).map((file) => {
        return snapshotStore.writeSnapshot(file);
      }),
    );
  });
}
/* c8 ignore stop */
