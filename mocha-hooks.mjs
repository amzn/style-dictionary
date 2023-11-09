import { use } from 'chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { chaiWtrSnapshot } from './snapshot-plugin/chai-wtr-snapshot.js';

const constantDate = new Date('2000-01-01');
// eslint-disable-next-line no-undef
globalThis.Date = function () {
  return constantDate;
};
// eslint-disable-next-line no-undef
globalThis.Date.now = function () {
  return constantDate;
};

export const mochaHooks = {
  beforeAll(done) {
    use(chaiAsPromised);
    use(chaiWtrSnapshot);
    done();
  },
};
