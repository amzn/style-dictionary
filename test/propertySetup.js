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
    propertySetup = require('../lib/transform/propertySetup');


describe('propertySetup', function() {
  it('should error if property is not an object', function() {
    assert.throws(
      propertySetup.bind(null, null, 'foo', []),
      Error,
      'Property object must be an object'
    );
  });

  it('should error if name in not a string', function() {
    assert.throws(
      propertySetup.bind(null, {}, null, []),
      Error,
      'Name must be a string'
    );
  });

  it('should error path is not an array', function() {
    assert.throws(
      propertySetup.bind(null, {}, 'name', null),
      Error,
      'Path must be an array'
    );
  });


  it('should work if all the args are proper', function() {
    var test = propertySetup(
      {value: "#fff"},
      "white",
      ["color","base"]
    );
    assert.isObject(test);
    assert.property(test, 'value');
    assert.property(test, 'original');
    assert.property(test, 'attributes');
    assert.property(test, 'path');
  });


  it('should not do anything and return the property if it has been setup previously', function() {
    var original = {value: "#fff", original:{}};
    var test = propertySetup(
      original,
      "white",
      ["color","base"]
    );
    assert.deepEqual(test, original);
  });

  it('should use attributes if already set', function() {
    var attributes = {"foo":"bar"};
    var test = propertySetup(
      {value:"#fff", attributes:attributes},
      "white",
      ["color","base"]
    );
    assert.deepEqual(test.attributes, attributes);
  });

  it('should use the name on the property if set', function() {
    var name = "name";
    var test = propertySetup(
      {value:"#fff", name:name},
      'white',
      ["color","base"]
    );
    assert.equal(test.name, name);
  });

  it('should use the name passed in if not set on the property', function() {
    var test = propertySetup(
      {value:"#fff"},
      'white',
      ["color","base"]
    );
    assert.equal(test.name, 'white');
  });
});
