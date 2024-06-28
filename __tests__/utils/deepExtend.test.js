/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
import { expect } from 'chai';
import deepExtend from '../../lib/utils/deepExtend.js';

describe('utils', () => {
  describe('deepExtend', () => {
    it('should return an object', () => {
      const test = deepExtend();
      expect(typeof test).to.equal('object');
    });

    it('should override tokens from right to left', () => {
      const test = deepExtend([{ foo: 'bar' }, { foo: 'baz' }]);
      expect(test).to.have.property('foo', 'baz');

      const test2 = deepExtend([{ foo: 'bar' }, { foo: 'baz' }, { foo: 'blah' }]);
      expect(test2).to.have.property('foo', 'blah');
    });

    it('overrides nested tokens', () => {
      const test = deepExtend([{ foo: { foo: 'bar' } }, { foo: { foo: 'baz' } }]);
      expect(test).to.have.nested.property('foo.foo', 'baz');

      const test2 = deepExtend([
        { foo: { foo: 'bar' } },
        { foo: { foo: 'baz' } },
        { foo: { foo: 'blah' } },
      ]);
      expect(test2).to.have.nested.property('foo.foo', 'blah');
    });

    it('properly merges nested tokens', () => {
      const test = deepExtend([{ foo: { bar: 'bar' } }, { foo: { baz: 'baz' } }]);
      expect(test).to.have.nested.property('foo.baz', 'baz');
      expect(test).to.have.nested.property('foo.bar', 'bar');

      const test2 = deepExtend([
        { foo: { bar: 'bar' } },
        { foo: { baz: 'baz' } },
        { foo: { blah: 'blah' } },
      ]);
      expect(test2).to.have.nested.property('foo.baz', 'baz');
      expect(test2).to.have.nested.property('foo.bar', 'bar');
      expect(test2).to.have.nested.property('foo.blah', 'blah');
    });

    it("shouldn't fail loudly if it is a normal deep extend", () => {
      const test = deepExtend([{ foo: { bar: 'bar' } }, { foo: { baz: 'baz' } }], function () {});
      expect(test).to.have.nested.property('foo.baz', 'baz');
      expect(test).to.have.nested.property('foo.bar', 'bar');
    });

    describe('collision detection', () => {
      it('should call the collision function if a collision happens', () => {
        expect(
          deepExtend.bind(null, [{ foo: { bar: 'bar' } }, { foo: { bar: 'baz' } }], function () {
            throw new Error('danger danger. high voltage.');
          }),
        ).to.throw('danger danger. high voltage.');
      });

      it('the collision function should have the proper arguments', () => {
        const test = deepExtend(
          [{ foo: { bar: 'bar' } }, { foo: { bar: 'baz' } }],
          function (opts) {
            expect(opts).to.have.nested.property('target.bar', 'bar');
            expect(opts).to.have.nested.property('copy.bar', 'baz');
            expect(opts.path[0]).to.equal('foo');
            expect(opts).to.have.property('key', 'bar');
          },
        );
        expect(test).to.have.nested.property('foo.bar', 'baz');
      });
    });
  });
});
