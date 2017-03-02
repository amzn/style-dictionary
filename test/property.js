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

var assert            = require('chai').assert,
    helpers           = require('./helpers'),
    transformProperty = require('../lib/transform/property');


var options = {
  transforms: [
    {
      type: 'attribute',
      transformer: function(prop) {
        return {
          foo: 'bar'
        }
      }
    },{
      type: 'attribute',
      transformer: function(prop) {
        return {bar: 'foo'}
      }
    },{
      type: 'name',
      matcher: function(prop) { return prop.attributes.foo === 'bar'; },
      transformer: function(prop) { return "hello"; }
    }
  ]
};

describe('transformProperty', function() {
  it('should work', function() {
    var test = transformProperty({attributes:{baz:'blah'}}, options);
    assert.equal(test.attributes.bar, 'foo');
    assert.equal(test.name, 'hello');
  });

  // Add more tests
});
