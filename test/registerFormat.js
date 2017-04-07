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

var assert = require('chai').assert,
    StyleDictionary = require('../index').extend({});


describe('registerFormat', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        formatter: function() {}
      }),
      Error,
      'transform name must be a string'
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: 1,
        formatter: function() {}
      }),
      Error,
      'transform name must be a string'
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: [],
        formatter: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: {},
        formatter: function() {}
      }),
      Error,
      'transform name must be a string'
    );
  });

  it('should error if formatter is not a function', function() {
    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: 'test'
      }),
      Error,
      'format formatter must be a function'
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: 'test',
        formatter: 1
      }),
      Error,
      'format formatter must be a function'
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: 'test',
        formatter: 'name'
      }),
      Error,
      'format formatter must be a function'
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: 'test',
        formatter: []
      }),
      Error,
      'format formatter must be a function'
    );

    assert.throws(
      StyleDictionary.registerFormat.bind(null, {
        name: 'test',
        formatter: {}
      }),
      Error,
      'format formatter must be a function'
    );
  });

  it('should work if name and formatter are good', function() {
    StyleDictionary.registerFormat({
      name: 'scss',
      formatter: function() {}
    });

    assert.isFunction(StyleDictionary.format['scss']);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isFunction(test.format['scss']);
  });
});
