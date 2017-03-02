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
      StyleDictionary.registerAction.bind({
        action: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 1,
        action: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: [],
        action: function() {}
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: {},
        action: function() {}
      })
    );
  });

  it('should error if formatter is not a function', function() {
    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test'
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: 1
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: 'name'
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: []
      })
    );

    assert.throws(
      StyleDictionary.registerAction.bind({
        name: 'test',
        action: {}
      })
    );
  });

  it('should work if name and formatter are good', function() {
    StyleDictionary.registerAction({
      name: 'scss',
      action: function() {}
    });

    assert.isFunction(StyleDictionary.action['scss']);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isFunction(test.action['scss']);
  });
});
