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

var assert        = require('chai').assert,
    helpers       = require('../helpers'),
    resolveObject = require('../../lib/utils/resolveObject');


describe('resolveObject', function() {
  it('should error on non-objects', function() {
    assert.throws(
      resolveObject.bind(null, 'foo'),
      Error,
      'Please pass an object in'
    );
    assert.throws(
      resolveObject.bind(null),
      Error,
      'Please pass an object in'
    );
    assert.throws(
      resolveObject.bind(null, 0),
      Error,
      'Please pass an object in'
    );
  });

  it('should do simple references', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/simple.json') );
    assert.equal(test.bar, 'bar');
  });

  it('should do nested references', function() {
    var obj = helpers.fileToJSON('test/json_files/nested_references.json');
    var test = resolveObject( obj );
    assert.equal(test.i, 2);
    assert.equal(test.a.b.d, 2);
    assert.equal(test.e.f.h, 1);
  });

  it('should handle nested pointers', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers.json') );
    assert.equal(test.b, 1);
    assert.equal(test.c, 1);
  });

  it('should handle deep nested pointers', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers_2.json') );
    assert.equal(test.a, 1);
    assert.equal(test.b, 1);
    assert.equal(test.c, 1);
    assert.equal(test.d, 1);
    assert.equal(test.e, 1);
    assert.equal(test.f, 1);
    assert.equal(test.g, 1);
  });

  it('should handle deep nested pointers with string interpolation', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers_3.json') );
    assert.equal(test.a, 'foo bon bee bae boo bla baz bar');
    assert.equal(test.b, 'foo bon bee bae boo bla baz');
    assert.equal(test.c, 'foo bon bee bae boo bla');
    assert.equal(test.d, 'foo bon bee bae boo');
    assert.equal(test.e, 'foo bon bee bae');
    assert.equal(test.f, 'foo bon bee');
    assert.equal(test.g, 'foo bon');
  });

  it('should handle deep nested pointers and nested references', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/nested_pointers_4.json') );
    assert.equal(test.a.a.a, 1);
    assert.equal(test.b.b.b, 1);
    assert.equal(test.c.c.c, 1);
    assert.equal(test.d.d.d, 1);
    assert.equal(test.e.e.e, 1);
    assert.equal(test.f.f.f, 1);
    assert.equal(test.g.g.g, 1);
  });


  it('should keep the type of the referenced property', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/reference_type.json') );
    assert.equal(test.d, 1);
    assert.isNumber(test.d);
    assert.isObject(test.e);
    assert.isArray(test.g);
    assert.equal(test.e.c, 2);
  });

  it('should handle and evaluate items in an array', function() {
    var test = resolveObject( helpers.fileToJSON(__dirname + '/../json_files/array.json') );
    assert.equal(test.d[0], 2);
    assert.equal(test.d[1], 1);
    assert.equal(test.e[0].a, 1);
    assert.equal(test.e[1].a, 2);
  });

  it('should throw if pointers don\'t exist', function() {
    assert.throws(
      resolveObject.bind( helpers.fileToJSON(__dirname + '/../json_files/non_existent.json'))
    );
  });

  it('should gracefully handle circular references', function() {
    assert.throws(
      resolveObject.bind(null,
        helpers.fileToJSON(__dirname + '/../json_files/circular.json')
      ),
      Error,
      'Circular definition: a | d'
    );
    assert.throws(
      resolveObject.bind(null,
        helpers.fileToJSON(__dirname + '/../json_files/circular_2.json')
      ),
      Error,
      'Circular definition: a.b.c | d'
    );
    assert.throws(
      resolveObject.bind(null,
        helpers.fileToJSON(__dirname + '/../json_files/circular_3.json')
      ),
      Error,
      'Circular definition: a.b.c | d.e.f'
    );
    assert.throws(
      resolveObject.bind(null,
        helpers.fileToJSON(__dirname + '/../json_files/circular_4.json')
      ),
      Error,
      'Circular definition: a.b.c | g.h'
    );
  });

  describe('ignoreKeys', function() {
    it('should handle default value of original', function() {
      var test = resolveObject({
        foo: { value: 'bar' },
        bar: {
          value: '{foo.value}',
          original: '{foo.value}'
        }
      });

      assert.equal(
        test.bar.original,
        '{foo.value}'
      );
    });

    it('should handle any nested keys under the ignoreKey', function() {
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

      assert.equal(
        test.bar.original.value,
        '{foo.value}'
      );
      assert.equal(
        test.bar.original.foo.bar,
        '{foo.value}'
      );
    });

    it('should handle passing in custom ignoreKeys', function() {
      var test = resolveObject({
        foo: { value: 'bar' },
        bar: {
          value: '{foo.value}',
          baz: '{foo.value}'
        }
      }, {
        ignoreKeys: ['baz']
      });

      assert.equal(
        test.bar.baz,
        '{foo.value}'
      );
    });

    it('should handle multiple keys', function() {
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

      assert.equal(
        test.bar.original,
        '{foo.value}'
      );
      assert.equal(
        test.bar.baz,
        '{foo.value}'
      );
    });

    it('should not ignore anything if set to null or empty array', function() {
      var test = resolveObject({
        foo: { value: 'bar' },
        bar: {
          value: '{foo.value}',
          original: '{foo.value}'
        }
      },{
        ignoreKeys: []
      });

      assert.equal(
        test.bar.original,
        'bar'
      );

      var test2 = resolveObject({
        foo: { value: 'bar' },
        bar: {
          value: '{foo.value}',
          original: '{foo.value}'
        }
      },{
        ignoreKeys: null
      });

      assert.equal(
        test2.bar.original,
        'bar'
      );

      var test3 = resolveObject({
        foo: { value: 'bar' },
        bar: {
          value: '{foo.value}',
          original: '{foo.value}'
        }
      },{
        ignoreKeys: undefined
      });

      assert.equal(
        test3.bar.original,
        'bar'
      );
    });
  });
});
