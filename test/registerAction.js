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
        action: function() {}
      }),
      Error,
      'name must be a string'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 1,
        action: function() {}
      }),
      Error,
      'name must be a string'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: [],
        action: function() {}
      }),
      Error,
      'name must be a string'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: {},
        action: function() {}
      }),
      Error,
      'name must be a string'
    );
  });

  it('should error if action is not a function', function() {
    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test'
      }),
      Error,
      'action must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        action: 1
      }),
      Error,
      'action must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        action: 'name'
      }),
      Error,
      'action must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        action: []
      }),
      Error,
      'action must be a function'
    );

    assert.throws(
      StyleDictionary.registerAction.bind(null, {
        name: 'test',
        action: {}
      }),
      Error,
      'action must be a function'
    );
  });

  it('should work if name and action are good', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      action: function() {}
    });

    assert.isFunction(StyleDictionary.action['scss'].action);
  });

  it('should handle a clean function', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      action: function() {},
      clean: function() {}
    });

    assert.isFunction(StyleDictionary.action['scss'].clean);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isFunction(test.action['scss'].action);
  });
});
