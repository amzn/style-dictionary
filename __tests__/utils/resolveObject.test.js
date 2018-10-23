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

const resolveObject = require('../../lib/utils/resolveObject');
const helpers = require('../__helpers');

describe('utils', () => {
  describe('resolveObject', () => {
    it('should error on non-objects', () => {
      expect(resolveObject.bind(null)).toThrow('Please pass an object in');
      expect(resolveObject.bind(null, 'foo')).toThrow('Please pass an object in');
      expect(resolveObject.bind(null, 0)).toThrow('Please pass an object in');
    });

    it('should not mutate the original object', () => {
      const original = helpers.fileToJSON(`${__dirname}/../__json_files/nested_references.json`);
      const test = resolveObject(original);
      expect(original).toHaveProperty('a.b.d', '{e.f.g}');
      expect(test).toHaveProperty('a.b.d', 2);
    });

    it('should do simple references', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/simple.json`));
      expect(test).toHaveProperty('bar', 'bar');
    });

    it('should do nested references', () => {
      const obj = helpers.fileToJSON(`${__dirname}/../__json_files/nested_references.json`);
      const test = resolveObject(obj);
      expect(test).toHaveProperty('i', 2);
      expect(test).toHaveProperty('a.b.d', 2);
      expect(test).toHaveProperty('e.f.h', 1);
    });

    it('should handle nested pointers', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/nested_pointers.json`));
      expect(test).toHaveProperty('b', 1);
      expect(test).toHaveProperty('c', 1);
    });

    it('should handle deep nested pointers', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/nested_pointers_2.json`));
      expect(test).toHaveProperty('a', 1);
      expect(test).toHaveProperty('b', 1);
      expect(test).toHaveProperty('c', 1);
      expect(test).toHaveProperty('d', 1);
      expect(test).toHaveProperty('e', 1);
      expect(test).toHaveProperty('f', 1);
      expect(test).toHaveProperty('g', 1);
    });

    it('should handle deep nested pointers with string interpolation', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/nested_pointers_3.json`));
      expect(test).toHaveProperty('a', 'foo bon bee bae boo bla baz bar');
      expect(test).toHaveProperty('b', 'foo bon bee bae boo bla baz');
      expect(test).toHaveProperty('c', 'foo bon bee bae boo bla');
      expect(test).toHaveProperty('d', 'foo bon bee bae boo');
      expect(test).toHaveProperty('e', 'foo bon bee bae');
      expect(test).toHaveProperty('f', 'foo bon bee');
      expect(test).toHaveProperty('g', 'foo bon');
    });

    it('should handle deep nested pointers and nested references', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/nested_pointers_4.json`));
      expect(test).toHaveProperty('a.a.a', 1);
      expect(test).toHaveProperty('b.b.b', 1);
      expect(test).toHaveProperty('c.c.c', 1);
      expect(test).toHaveProperty('d.d.d', 1);
      expect(test).toHaveProperty('e.e.e', 1);
      expect(test).toHaveProperty('f.f.f', 1);
      expect(test).toHaveProperty('g.g.g', 1);
    });

    it('should keep the type of the referenced property', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/reference_type.json`));
      expect(test).toHaveProperty('d', 1);
      expect(typeof test.d).toBe('number');
      expect(typeof test.e).toBe('object');
      expect(Array.isArray(test.f)).toBeTruthy();
      expect(test).toHaveProperty('e.c', 2);
    });

    it('should handle and evaluate items in an array', () => {
      const test = resolveObject(helpers.fileToJSON(`${__dirname}/../__json_files/array.json`));
      expect(test.d[0]).toBe(2);
      expect(test.d[1]).toBe(1);
      expect(test.e[0].a).toBe(1);
      expect(test.e[1].a).toBe(2);
    });

    it("should throw if pointers don't exist", () => {
      expect(resolveObject.bind(helpers.fileToJSON(`${__dirname}/../__json_files/non_existent.json`))).toThrow();
    });

    it('should gracefully handle circular references', () => {
      expect(resolveObject.bind(null, helpers.fileToJSON(`${__dirname}/../__json_files/circular.json`))).toThrow(
        'Circular definition: a | d'
      );
      expect(resolveObject.bind(null, helpers.fileToJSON(`${__dirname}/../__json_files/circular_2.json`))).toThrow(
        'Circular definition: a.b.c | d'
      );
      expect(resolveObject.bind(null, helpers.fileToJSON(`${__dirname}/../__json_files/circular_3.json`))).toThrow(
        'Circular definition: a.b.c | d.e.f'
      );
      expect(resolveObject.bind(null, helpers.fileToJSON(`${__dirname}/../__json_files/circular_4.json`))).toThrow(
        'Circular definition: a.b.c | g.h'
      );
    });

    describe('ignoreKeys', () => {
      it('should handle default value of original', () => {
        const test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: '{foo.value}',
          },
        });
        expect(test).toHaveProperty('bar.original', '{foo.value}');
      });

      it('should handle any nested keys under the ignoreKey', () => {
        const test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: {
              value: '{foo.value}',
              foo: {
                bar: '{foo.value}',
              },
            },
          },
        });
        expect(test).toHaveProperty('bar.original.value', '{foo.value}');
        expect(test).toHaveProperty('bar.original.foo.bar', '{foo.value}');
      });

      it('should handle passing in custom ignoreKeys', () => {
        const test = resolveObject(
          {
            foo: { value: 'bar' },
            bar: {
              value: '{foo.value}',
              baz: '{foo.value}',
            },
          },
          {
            ignoreKeys: ['baz'],
          }
        );
        expect(test).toHaveProperty('bar.baz', '{foo.value}');
      });

      it('should handle multiple keys', () => {
        const test = resolveObject(
          {
            foo: { value: 'bar' },
            bar: {
              value: '{foo.value}',
              original: '{foo.value}',
              baz: '{foo.value}',
            },
          },
          {
            ignoreKeys: ['baz', 'original'],
          }
        );
        expect(test).toHaveProperty('bar.original', '{foo.value}');
        expect(test).toHaveProperty('bar.baz', '{foo.value}');
      });

      it('should not ignore anything if set to null or empty array', () => {
        const test = resolveObject(
          {
            foo: { value: 'bar' },
            bar: {
              value: '{foo.value}',
              original: '{foo.value}',
            },
          },
          {
            ignoreKeys: [],
          }
        );
        expect(test).toHaveProperty('bar.original', 'bar');

        const test2 = resolveObject(
          {
            foo: { value: 'bar' },
            bar: {
              value: '{foo.value}',
              original: '{foo.value}',
            },
          },
          {
            ignoreKeys: null,
          }
        );
        expect(test2).toHaveProperty('bar.original', 'bar');

        const test3 = resolveObject(
          {
            foo: { value: 'bar' },
            bar: {
              value: '{foo.value}',
              original: '{foo.value}',
            },
          },
          {
            ignoreKeys: undefined,
          }
        );
        expect(test3).toHaveProperty('bar.original', 'bar');
      });
    });

    it('should handle spaces', () => {
      const test = resolveObject({
        foo: { value: 'bar' },
        bar: { value: '{ foo.value }' },
      });
      expect(test).toHaveProperty('foo.value', test.bar.value);
    });

    it('should collect multiple reference errors', () => {
      expect(
        resolveObject.bind(null, helpers.fileToJSON(`${__dirname}/../__json_files/multiple_reference_errors.json`))
      ).toThrow('Failed due to 3 errors:');
    });
  });
});
