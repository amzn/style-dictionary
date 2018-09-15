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

var helpers = require('./__helpers');
var keys = require('lodash/keys');
var config = helpers.fileToJSON(__dirname + '/__configs/test.json');
var StyleDictionary = require('../index').extend(config);

describe('exportPlatform', () => {

  it('should throw if not given a platform', () => {
    expect(
      function(){
        StyleDictionary.exportPlatform()
      }
    ).toThrow();
  });

  it('should throw if not given a proper platform', () => {
    expect(
      function(){
        StyleDictionary.exportPlatform('foo');
      }
    ).toThrow();
  });

  it('should not throw if given a proper platform', () => {
    expect(
      function(){
        StyleDictionary.exportPlatform('web');
      }
    ).not.toThrow();
  });

  it('should return an object', () => {
    var dictionary = StyleDictionary.exportPlatform('web');
    expect(typeof dictionary).toBe('object');
  });

  it('should have the same structure as the original properties', () => {
    var dictionary = StyleDictionary.exportPlatform('web');
    expect(keys(dictionary)).toEqual(keys(StyleDictionary.properties));
  });

  it('should have resolved references', () => {
    var dictionary = StyleDictionary.exportPlatform('web');
    expect(dictionary.color.font.link.value).toEqual(dictionary.color.base.blue['100'].value);
  });

  it('should have applied transforms', () => {
    var dictionary = StyleDictionary.exportPlatform('web');
    expect(dictionary.size.padding.base.value.indexOf('px')).toBeGreaterThan(0);
  });

  it('should not have mutated the original properties', () => {
    var dictionary = StyleDictionary.exportPlatform('web');
    expect(dictionary.color.font.link.value).not.toEqual(StyleDictionary.properties.color.font.link.value);
    expect(StyleDictionary.properties.size.padding.base.value.indexOf('px')).toBe(-1);
  });

  // Make sure when we perform transforms and resolve references
  // we don't mutate the original object added to the property.
  it('properties should have original value untouched', () => {
    var dictionary = StyleDictionary.exportPlatform('web');
    var properties = helpers.fileToJSON(__dirname + '/__properties/colors.json');
    expect(dictionary.color.font.link.original.value).toEqual(properties.color.font.link.value);
  });

});
