import { use } from 'chai';
import chaiAsPromised from '@esm-bundle/chai-as-promised';
import { chaiWtrSnapshot } from './snapshot-plugin/chai-wtr-snapshot.js';
import { fixDate } from './__tests__/__helpers.js';

fixDate();

export const mochaHooks = {
  beforeAll(done) {
    use(chaiAsPromised);
    use(chaiWtrSnapshot);
    done();
  },
};
