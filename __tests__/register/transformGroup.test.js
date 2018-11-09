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

var StyleDictionary = require('../../index');
var StyleDictionaryExtended = StyleDictionary.extend({});

describe('register/transformGroup', () => {
  it('should error if name is not a string', () => {
    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        transforms: ['foo']
      })
    ).toThrow('transform name must be a string');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: 1,
        transforms: ['foo']
      })
    ).toThrow('transform name must be a string');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: [],
        transforms: ['foo']
      })
    ).toThrow('transform name must be a string');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: {},
        transforms: ['foo']
      })
    ).toThrow('transform name must be a string');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: function() {},
        transforms: ['foo']
      })
    ).toThrow('transform name must be a string');
  });

  it('should error if transforms isnt an array', () => {
    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: 'foo'
      })
    ).toThrow('transforms must be an array of registered value transforms');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: 'foo',
        transforms: 'foo'
      })
    ).toThrow('transforms must be an array of registered value transforms');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: 'foo',
        transforms: {}
      })
    ).toThrow('transforms must be an array of registered value transforms');

    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(null, {
        name: 'foo',
        transforms: function() {}
      })
    ).toThrow('transforms must be an array of registered value transforms');
  });

  it('should error if transforms arent registered', () => {
    expect(
      StyleDictionaryExtended.registerTransformGroup.bind(StyleDictionary,
      {
        name: 'foo',
        transforms: ['foo']
      })
    ).toThrow('transforms must be an array of registered value transforms');
  });

  it('should work if everything is good', () => {
    StyleDictionaryExtended.registerTransformGroup({
      name: 'foo',
      transforms: ['size/px']
    });
    expect(Array.isArray(StyleDictionaryExtended.transformGroup.foo)).toBeTruthy();
    expect(typeof StyleDictionaryExtended.transformGroup.foo[0]).toBe('string');
    expect(StyleDictionaryExtended.transformGroup.foo[0]).toBe('size/px');
  });

  it('should properly pass the registered format to instances', () => {
    var SDE2 = StyleDictionaryExtended.extend({});
    expect(Array.isArray(SDE2.transformGroup.foo)).toBeTruthy();
    expect(typeof SDE2.transformGroup.foo[0]).toBe('string');
    expect(SDE2.transformGroup.foo[0]).toBe('size/px');
  });
});
