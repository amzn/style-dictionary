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


describe('registerTransformGroup', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerTransformGroup.bind({transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 1, transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: [], transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: {}, transforms: ['foo']})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: function() {}, transforms: ['foo']})
    );
  });

  it('should error if transforms isnt an array', function() {
    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo'})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: 'foo'})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: {}})
    );

    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: function() {}})
    );
  });

  it('should error if transforms arent registered', function() {
    assert.throws(
      StyleDictionary.registerTransformGroup.bind({name: 'foo', transforms: ['bar']})
    );
  });

  it('should work if everything is good', function() {
    StyleDictionary.registerTransformGroup({
      name: 'foo',
      transforms: ['foo']
    });

    assert.isArray(StyleDictionary.transformGroup.foo);
    assert.isString(StyleDictionary.transformGroup.foo[0]);
  });

  it('should properly pass the registered format to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isArray(test.transformGroup.foo);
    assert.isString(test.transformGroup.foo[0]);
  });
});
