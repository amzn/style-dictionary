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

var resolveObject = require('../../lib/utils/resolveObject');
var helpers = require('../__helpers');
var GroupMessages = require('../../lib/utils/groupMessages');

var PROPERTY_REFERENCE_WARNINGS = GroupMessages.GROUP.PropertyReferenceWarnings;

describe('utils', () => {
  describe('resolveObject', () => {

    it('should error on non-objects', () => {
      expect(
        resolveObject.bind(null)
      ).toThrow('Please pass an object in');
      expect(
        resolveObject.bind(null, 'foo')
      ).toThrow('Please pass an object in');
      expect(
        resolveObject.bind(null, 0)
      ).toThrow('Please pass an object in');
    });

    it('should not mutate the original object', () => {
      var original = helpers.fileToJSON(__dirname + '/../__json_files/nested_references.json');
      var test = resolveObject( original );
      expect(original).toHaveProperty('a.b.d', '{e.f.g}');
      expect(test).toHaveProperty('a.b.d', 2);
    });

    it('should do simple references', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/simple.json') );
      expect(test).toHaveProperty('bar', 'bar');
    });
    
    it('should do simple interpolation for both strings and numbers', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/interpolation.json') );
      expect(test).toHaveProperty('c', 'test1 value text after');
      expect(test).toHaveProperty('d', 'text before test1 value');
      expect(test).toHaveProperty('e', 'text before test1 value text after');
      expect(test).toHaveProperty('f', '123 text after');
      expect(test).toHaveProperty('g', 'text before 123');
      expect(test).toHaveProperty('h', 'text before 123 text after');
    });

    it('should do nested references', () => {
      var obj = helpers.fileToJSON(__dirname + '/../__json_files/nested_references.json');
      var test = resolveObject( obj );
      expect(test).toHaveProperty('i', 2);
      expect(test).toHaveProperty('a.b.d', 2);
      expect(test).toHaveProperty('e.f.h', 1);
    });

    it('should handle nested pointers', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/nested_pointers.json') );
      expect(test).toHaveProperty('b', 1);
      expect(test).toHaveProperty('c', 1);
    });

    it('should handle deep nested pointers', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/nested_pointers_2.json') );
      expect(test).toHaveProperty('a', 1);
      expect(test).toHaveProperty('b', 1);
      expect(test).toHaveProperty('c', 1);
      expect(test).toHaveProperty('d', 1);
      expect(test).toHaveProperty('e', 1);
      expect(test).toHaveProperty('f', 1);
      expect(test).toHaveProperty('g', 1);
    });

    it('should handle deep nested pointers with string interpolation', () => {
        var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/nested_pointers_3.json') );
        expect(test).toHaveProperty('a', 'foo bon bee bae boo bla baz bar');
        expect(test).toHaveProperty('b', 'foo bon bee bae boo bla baz');
        expect(test).toHaveProperty('c', 'foo bon bee bae boo bla');
        expect(test).toHaveProperty('d', 'foo bon bee bae boo');
        expect(test).toHaveProperty('e', 'foo bon bee bae');
        expect(test).toHaveProperty('f', 'foo bon bee');
        expect(test).toHaveProperty('g', 'foo bon');
      }
    );

    it('should handle deep nested pointers and nested references', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/nested_pointers_4.json') );
      expect(test).toHaveProperty('a.a.a', 1);
      expect(test).toHaveProperty('b.b.b', 1);
      expect(test).toHaveProperty('c.c.c', 1);
      expect(test).toHaveProperty('d.d.d', 1);
      expect(test).toHaveProperty('e.e.e', 1);
      expect(test).toHaveProperty('f.f.f', 1);
      expect(test).toHaveProperty('g.g.g', 1);
    });


    it('should keep the type of the referenced property', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/reference_type.json') );
      expect(test).toHaveProperty('d', 1);
      expect(typeof test.d).toBe('number');
      expect(typeof test.e).toBe('object');
      expect(Array.isArray(test.f)).toBeTruthy();
      expect(test).toHaveProperty('e.c', 2);
    });

    it('should handle and evaluate items in an array', () => {
      var test = resolveObject( helpers.fileToJSON(__dirname + '/../__json_files/array.json') );
      expect(test.d[0]).toBe(2);
      expect(test.d[1]).toBe(1);
      expect(test.e[0].a).toBe(1);
      expect(test.e[1].a).toBe(2);
    });

    it('should throw if pointers don\'t exist', () => {
      expect(
        resolveObject.bind( helpers.fileToJSON(__dirname + '/../__json_files/non_existent.json'))
      ).toThrow();
    });

    it('should gracefully handle basic circular references', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/circular.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(1);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).toBe(JSON.stringify([
         'Circular definition cycle:  a, b, c, d, a'
      ]));
    });

    it('should gracefully handle basic and nested circular references', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/circular_2.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(1);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).toBe(JSON.stringify([
        'Circular definition cycle:  a.b.c, j, a.b.c'
      ]));
    });

    it('should gracefully handle nested circular references', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/circular_3.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(1);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).toBe(JSON.stringify([
        'Circular definition cycle:  a.b, c.d.e, a.b'
      ]));
    });

    it('should gracefully handle multiple nested circular references', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/circular_4.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(1);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).toBe(JSON.stringify([
        'Circular definition cycle:  a.b.c.d, e.f.g, h.i, a.b.c.d',
      ]));
    });

    it('should gracefully handle down-chain circular references', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/circular_5.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(1);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).toBe(JSON.stringify([
        'Circular definition cycle:  l, m, l',
      ]));
    });

    it('should correctly replace multiple references without reference errors', function() {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      var obj = resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/not_circular.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(0);
      expect(JSON.stringify(obj)).toBe(JSON.stringify({
        prop1: { value: 'test1 value' },
        prop2: { value: 'test2 value' },
        prop3: { value: 'test1 value' },
        prop4: { value: 'test1 value' },
        prop5: { value: 5 },
        prop6: { value: 6 },
        prop7: { value: 5 },
        prop8: { value: 5 },
        prop12: { value: 'test1 value, test2 value and some extra stuff' },
        prop124: { value: 'test1 value, test2 value and test1 value' },
        prop15 : { value: 'test1 value, 5 and some extra stuff' },
        prop156 : { value: 'test1 value, 5 and 6' },
        prop1568 : { value: 'test1 value, 5, 6 and 5' }
      }));
    });

    describe('ignorePaths', () => {
      it('should not resolve values containing variables in ignored paths', () => {
        const test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}'
          }
        }, {ignorePaths: ['foo.value']});

        expect(test).toHaveProperty ('bar.value', '{foo.value}');
      });
    });

    describe('ignoreKeys', () => {
      it('should handle default value of original', () => {
        var test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: '{foo.value}'
          }
        });
        expect(test).toHaveProperty ('bar.original', '{foo.value}');
      });

      it('should handle any nested keys under the ignoreKey', () => {
        var test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: {
              value: '{foo.value}',
              foo: {
                bar: '{foo.value}'
              }
            }
          }
        });
        expect(test).toHaveProperty ('bar.original.value', '{foo.value}');
        expect(test).toHaveProperty ('bar.original.foo.bar', '{foo.value}');
      });

      it('should handle passing in custom ignoreKeys', () => {
        var test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            baz: '{foo.value}'
          }
        }, {
          ignoreKeys: ['baz']
        });
        expect(test).toHaveProperty ('bar.baz', '{foo.value}');
      });

      it('should handle multiple keys', () => {
        var test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: '{foo.value}',
            baz: '{foo.value}'
          }
        },{
          ignoreKeys: ['baz','original']
        });
        expect(test).toHaveProperty ('bar.original', '{foo.value}');
        expect(test).toHaveProperty ('bar.baz', '{foo.value}');
      });

      it('should not ignore anything if set to null or empty array', () => {
        var test = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: '{foo.value}'
          }
        },{
          ignoreKeys: []
        });
        expect(test).toHaveProperty ('bar.original', 'bar');

        var test2 = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: '{foo.value}'
          }
        },{
          ignoreKeys: null
        });
        expect(test2).toHaveProperty ('bar.original', 'bar');

        var test3 = resolveObject({
          foo: { value: 'bar' },
          bar: {
            value: '{foo.value}',
            original: '{foo.value}'
          }
        },{
          ignoreKeys: undefined
        });
        expect(test3).toHaveProperty ('bar.original', 'bar');
      });
    });

    it('should handle spaces', () => {
      var test = resolveObject({
        foo: { value: 'bar' },
        bar: { value: '{ foo.value }'}
      });
      expect(test).toHaveProperty ('foo.value', test.bar.value);
    });

    it('should collect multiple reference errors', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);

      resolveObject(helpers.fileToJSON(__dirname + '/../__json_files/multiple_reference_errors.json'));
      expect(GroupMessages.count(PROPERTY_REFERENCE_WARNINGS)).toBe(3);
      expect(JSON.stringify(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS))).toBe(JSON.stringify([
         "Reference doesn't exist: a.b tries to reference b.a, which is not defined",
         "Reference doesn't exist: a.c tries to reference b.c, which is not defined",
         "Reference doesn't exist: a.d tries to reference d, which is not defined"
      ]));
    });

    it('should handle 0', () => {
      GroupMessages.clear(PROPERTY_REFERENCE_WARNINGS);
      var test = resolveObject({
        "test": { "value": "{zero.value}" },
        "zero": { "value": 0}
      });
      expect(GroupMessages.fetchMessages(PROPERTY_REFERENCE_WARNINGS).length).toBe(0);
      expect(test.test.value).toBe(0);
    });

  });
});
