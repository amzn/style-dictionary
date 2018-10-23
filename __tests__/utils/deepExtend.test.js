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

const deepExtend = require('../../lib/utils/deepExtend');

describe('utils', () => {
  describe('deepExtend', () => {
    it('should return an object', () => {
      const test = deepExtend();
      expect(typeof test).toBe('object');
    });

    it('should override properties from right to left', () => {
      const test = deepExtend([{ foo: 'bar' }, { foo: 'baz' }]);
      expect(test).toHaveProperty('foo', 'baz');

      const test2 = deepExtend([{ foo: 'bar' }, { foo: 'baz' }, { foo: 'blah' }]);
      expect(test2).toHaveProperty('foo', 'blah');
    });

    it('should override nested properties', () => {
      const test = deepExtend([{ foo: { foo: 'bar' } }, { foo: { foo: 'baz' } }]);
      expect(test).toHaveProperty('foo.foo', 'baz');

      const test2 = deepExtend([{ foo: { foo: 'bar' } }, { foo: { foo: 'baz' } }, { foo: { foo: 'blah' } }]);
      expect(test2).toHaveProperty('foo.foo', 'blah');
    });

    it('should override nested properties', () => {
      const test = deepExtend([{ foo: { bar: 'bar' } }, { foo: { baz: 'baz' } }]);
      expect(test).toHaveProperty('foo.baz', 'baz');
      expect(test).toHaveProperty('foo.bar', 'bar');

      const test2 = deepExtend([{ foo: { bar: 'bar' } }, { foo: { baz: 'baz' } }, { foo: { blah: 'blah' } }]);
      expect(test2).toHaveProperty('foo.baz', 'baz');
      expect(test2).toHaveProperty('foo.bar', 'bar');
      expect(test2).toHaveProperty('foo.blah', 'blah');
    });

    it("shouldn't fail loudly if it is a normal deep extend", () => {
      const test = deepExtend([{ foo: { bar: 'bar' } }, { foo: { baz: 'baz' } }], () => {});
      expect(test).toHaveProperty('foo.baz', 'baz');
      expect(test).toHaveProperty('foo.bar', 'bar');
    });

    describe('collision detection', () => {
      it('should call the collision function if a collision happens', () => {
        expect(
          deepExtend.bind(null, [{ foo: { bar: 'bar' } }, { foo: { bar: 'baz' } }], () => {
            throw new Error('danger danger. high voltage.');
          })
        ).toThrow('danger danger. high voltage.');
      });

      it('the collision function should have the proper arguments', () => {
        const test = deepExtend([{ foo: { bar: 'bar' } }, { foo: { bar: 'baz' } }], opts => {
          expect(opts).toHaveProperty('target.bar', 'bar');
          expect(opts).toHaveProperty('copy.bar', 'baz');
          expect(opts.path[0]).toBe('foo');
          expect(opts).toHaveProperty('key', 'bar');
        });
        expect(test).toHaveProperty('foo.bar', 'baz');
      });
    });
  });
});
