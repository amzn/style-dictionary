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

var assert          = require('chai').assert,
    helpers         = require('./helpers'),
    keys            = require('lodash/keys'),
    StyleDictionary = require('../index');

// Test configs
var config = helpers.fileToJSON(__dirname + '/configs/test.json');
var test = StyleDictionary.extend(config);

describe('exportPlatform', function() {

  it('should throw if not given a proper platform', function () {
    assert.throws(test.exportPlatform, Error);
  });

  it('should throw if not given a proper platform', function () {
    assert.throws(function(){
      test.exportPlatform('foo');
    });
  });

  it('should not throw if given a proper platform', function () {
    assert.doesNotThrow(function(){
      test.exportPlatform('web');
    });
  });

  it('should return an object', function () {
    var dictionary = test.exportPlatform('web');
    assert.isObject(dictionary);
  });

  it('should have the same structure as the original properties', function () {
    var dictionary = test.exportPlatform('web');
    assert.deepEqual(
      keys(dictionary),
      keys(test.properties)
    );
  });

  it('should have resolved references', function () {
    var dictionary = test.exportPlatform('web');
    assert.equal(
      dictionary.color.font.link.value,
      dictionary.color.base.blue['100'].value
    );
  });

  it('should have applied transforms', function () {
    var dictionary = test.exportPlatform('web');
    assert(
      dictionary.size.padding.base.value.indexOf('px')
    );
  });

  it('should not have mutated the original properties', function () {
    var dictionary = test.exportPlatform('web');

    assert.notEqual(
      dictionary.color.font.link.value,
      test.properties.color.font.link.value
    );

    assert.equal(
      test.properties.size.padding.base.value.indexOf('px'),
      -1
    );
  });

  // Make sure when we perform transforms and resolve references
  // we don't mutate the original object added to the property.
  it('properties should have original value untouched', function() {
    var dictionary = test.exportPlatform('web');
    var properties = helpers.fileToJSON('test/properties/colors.json');

    assert.equal(
      dictionary.color.font.link.original.value,
      properties.color.font.link.value
    );
  });
});
