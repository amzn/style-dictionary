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


describe('registerAction', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        do: function() {}
      }),
      Error,
      'name must be a string'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 1,
        do: function() {}
      }),
      Error,
      'name must be a string'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: [],
        do: function() {}
      }),
      Error,
      'name must be a string'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: {},
        do: function() {}
      }),
      Error,
      'name must be a string'
    );
  });

  it('should error if do is not a function', function() {
    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test'
      }),
      Error,
      'do must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        do: 1
      }),
      Error,
      'do must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        do: 'name'
      }),
      Error,
      'do must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        do: []
      }),
      Error,
      'do must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        do: {}
      }),
      Error,
      'do must be a function'
    );
  });

  it('should work if name and do are good', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      do: function() {}
    });

    assert.isFunction(StyleDictionary.action['scss'].do);
  });

  it('should handle an undo function', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      do: function() {},
      undo: function() {}
    });

    assert.isFunction(StyleDictionary.action['scss'].undo);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isFunction(test.action['scss'].do);
  });
});
