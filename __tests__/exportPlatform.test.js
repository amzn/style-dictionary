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

const helpers = require('./__helpers');
const keys = require('lodash/keys');
const config = helpers.fileToJSON(__dirname + '/__configs/test.json');
const StyleDictionary = require('../index');
const styleDictionary = StyleDictionary.extend(config);

describe('exportPlatform', () => {

  it('should throw if not given a platform', () => {
    expect(
      function(){
        styleDictionary.exportPlatform()
      }
    ).toThrow();
  });

  it('should throw if not given a proper platform', () => {
    expect(
      function(){
        styleDictionary.exportPlatform('foo');
      }
    ).toThrow();
  });

  it('should not throw if given a proper platform', () => {
    expect(
      function(){
        styleDictionary.exportPlatform('web');
      }
    ).not.toThrow();
  });

  it('should return an object', () => {
    var dictionary = styleDictionary.exportPlatform('web');
    expect(typeof dictionary).toBe('object');
  });

  it('should have the same structure as the original properties', () => {
    var dictionary = styleDictionary.exportPlatform('web');
    expect(keys(dictionary)).toEqual(keys(styleDictionary.properties));
  });

  it('should have resolved references', () => {
    var dictionary = styleDictionary.exportPlatform('web');
    expect(dictionary.color.font.link.value).toEqual(dictionary.color.base.blue['100'].value);
  });

  it('should have applied transforms', () => {
    var dictionary = styleDictionary.exportPlatform('web');
    expect(dictionary.size.padding.base.value.indexOf('px')).toBeGreaterThan(0);
  });

  it('should have applied transforms for props with refs in it', () => {
    const StyleDictionaryExtended = styleDictionary.extend({
      platforms: {
        test: {
          transforms: ['color/css','color/darken']
        }
      }
    });

    StyleDictionaryExtended.registerTransform({
      type: 'value',
      name: 'color/darken',
      transitive: true,
      matcher: function(prop) { return !!prop.original.transformColor; },
      transformer: function(prop) { return prop.value + '-darker'; }
    });

    const dictionary = StyleDictionaryExtended.exportPlatform('test');

    expect(dictionary.color.button.active.value).toEqual('#0077CC-darker');
    expect(dictionary.color.button.hover.value).toEqual('#0077CC-darker-darker');
  });

  it('should not have mutated the original properties', () => {
    var dictionary = styleDictionary.exportPlatform('web');
    expect(dictionary.color.font.link.value).not.toEqual(styleDictionary.properties.color.font.link.value);
    expect(styleDictionary.properties.size.padding.base.value.indexOf('px')).toBe(-1);
  });

  // Make sure when we perform transforms and resolve references
  // we don't mutate the original object added to the property.
  it('properties should have original value untouched', () => {
    var dictionary = styleDictionary.exportPlatform('web');
    var properties = helpers.fileToJSON(__dirname + '/__properties/colors.json');
    expect(dictionary.color.font.link.original.value).toEqual(properties.color.font.link.value);
  });

  it('should not mutate original value if value is an object', () => {
    const dictionary = StyleDictionary.extend({
      properties: {
        color: {
          red: {
            value: {
              h: "{hue.red}",
              s: 50,
              l: 50
            }
          }
        },
        hue: {
          red: 20
        }
      },
      platforms: {
        web: {
          transformGroup: 'web'
        }
      }
    }).exportPlatform('web');
    expect(dictionary.color.red.original.value.h).toEqual("{hue.red}");
    expect(dictionary.color.red.value.h).toEqual(20);
  });

  describe('reference warnings', () => {
    const errorMessage = `Problems were found when trying to resolve property references`;
    const platforms = {
      css: {
        transformGroup: `css`
      }
    }

    it('should throw if there are simple property reference errors', () => {
      const properties = {
        a: "#ff0000",
        b: "{c}"
      }
      expect(
        function() {
          StyleDictionary.extend({
            properties,
            platforms
          }).exportPlatform('css')
        }
      ).toThrow(errorMessage);
    });

    it('should throw if there are circular reference errors', () => {
      const properties = {
        a: "{b}",
        b: "{a}"
      }
      expect(
        function() {
          StyleDictionary.extend({
            properties,
            platforms
          }).exportPlatform('css')
        }
      ).toThrow(errorMessage);
    });

    it('should throw if there are complex property reference errors', () => {
      const properties = {
        color: {
          core: {
            red: { valuer: "#ff0000" }, // notice misspelling
            blue: { "value:": "#0000ff" }
          },
          danger: { value: "{color.core.red.value}" },
          warning: { value: "{color.base.red.valuer}" },
          info: { value: "{color.core.blue.value}" },
          error: { value: "{color.danger.value}" }
        }
      }
      expect(
        function() {
          StyleDictionary.extend({
            properties,
            platforms
          }).exportPlatform('css')
        }
      ).toThrow(errorMessage);
    });
  });

});
