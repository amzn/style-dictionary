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

var assert = require('chai').assert;
var StyleDictionary = require('../../index').extend({});


describe('registerTemplate', function() {
  it('should error if name is not a string', function() {
    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {}),
      Error,
      /Template name must be a string:/
    );

    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: 1,
      }),
      Error,
      /Template name must be a string:/
    );

    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: [],
      }),
      Error,
      /Template name must be a string:/
    );

    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: {},
      }),
      Error,
      /Template name must be a string:/
    );
  });

  it('should error if path is not a string', function() {
    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: 'data',
      }),
      Error,
      /Template path must be a string:/
    );

    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: 'data',
        template: 1,
      }),
      Error,
      /Template path must be a string:/
    );

    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: 'data',
        template: [],
      }),
      Error,
      /Template path must be a string:/
    );

    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: 'data',
        template: {},
      }),
      Error,
      /Template path must be a string:/
    );
  });

  it('should error if path is not a file', function() {
    assert.throws(
      StyleDictionary.registerTemplate.bind(null, {
        name: 'data',
        template: 'non_existent_file',
      }),
      Error,
      /Can\'t find template: /
    );
  });

  it('should return StyleDictionary', function() {
    assert(
      StyleDictionary.registerTemplate.bind(null, {
        name: 'data',
        template: 'registerTemplate.js',
      }),
      StyleDictionary
    );
  });
});
