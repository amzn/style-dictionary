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


describe('registerTransform', function() {
  it('should error if type is not a string', function() {
    assert.throws(
      StyleDictionary.registerTransform.bind({type: 3})
    );
  });

  it('should error if type is not a valid type', function() {
    assert.throws(
      StyleDictionary.registerTransform.bind({type: 'foo'})
    );
  });

  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerTransform.bind({type: 'name'})
    );
  });

  it('should error if matcher is not a function', function() {
    assert.throws(
      StyleDictionary.registerTransform.bind({type: 'name', matcher: 'foo'})
    );
  });

  it('should error if transformer is not a function', function() {
    assert.throws(
      StyleDictionary.registerTransform.bind({
        type: 'name',
        matcher: function() { return true; },
        transformer: 'foo'
      })
    );
  });

  it('should work if type, matcher, and transformer are all proper', function() {
    StyleDictionary.registerTransform({
      type: 'name',
      name: 'foo',
      matcher: function() { return true; },
      transformer: function() { return true; }
    });
    assert.isObject(StyleDictionary.transform.foo);
    assert.equal(StyleDictionary.transform.foo.type, 'name');
    assert.isFunction(StyleDictionary.transform.foo.matcher);
    assert.isFunction(StyleDictionary.transform.foo.transformer);
  });


  it('should properly pass the registered transform to instances', function() {
    var test = StyleDictionary.extend({});
    assert.isObject(test.transform.foo);
    assert.equal(test.transform.foo.type, 'name');
    assert.isFunction(test.transform.foo.matcher);
    assert.isFunction(test.transform.foo.transformer);
  });
});
