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
    expect(Object.keys(dictionary)).toEqual(Object.keys(styleDictionary.properties));
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

  it('should have transitive transforms applied without .value in references', () => {
    const dictionary = StyleDictionary.extend({
      tokens: {
        one: { value: 'foo' },
        two: { value: '{one.value}' },
        three: { value: '{two}' },
        four: { value: '{one}' },
        five: { value: '{four.value}' },
        six: { value: '{one}' },
        seven: { value: '{six}'},
        eight: { value: '{one.value}' },
        nine: { value: '{eight.value}' }
      },
      transform: {
        transitive: {
          type: 'value',
          transitive: true,
          transformer: (token) => `${token.value}-bar`
        }
      },
      platforms: {
        test: {
          transforms: ['transitive']
        }
      }
    }).exportPlatform('test');

    expect(dictionary.one.value).toEqual('foo-bar');
    expect(dictionary.two.value).toEqual('foo-bar-bar');
    expect(dictionary.three.value).toEqual('foo-bar-bar-bar');
    expect(dictionary.four.value).toEqual('foo-bar-bar');
    expect(dictionary.five.value).toEqual('foo-bar-bar-bar');
    expect(dictionary.six.value).toEqual('foo-bar-bar');
    expect(dictionary.seven.value).toEqual('foo-bar-bar-bar');
    expect(dictionary.eight.value).toEqual('foo-bar-bar');
    expect(dictionary.nine.value).toEqual('foo-bar-bar-bar');
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

  it('should handle .value and non .value references per the W3C spec', () => {
    const tokens = {
      colors: {
        red: { value: '#f00' },
        error: { value: '{colors.red}' },
        danger: { value: '{colors.error}' },
        alert: { value: '{colors.error.value}' },
      }
    }

    const expected = {
      colors: {
        red: {
          value: '#f00',
          name: 'colors-red',
          path: ['colors','red'],
          attributes: {
            category: 'colors',
            type: 'red'
          },
          original: {
            value: '#f00'
          }
        },
        error: {
          value: '#f00',
          name: 'colors-error',
          path: ['colors','error'],
          attributes: {
            category: 'colors',
            type: 'error'
          },
          original: {
            value: '{colors.red}'
          }
        },
        danger: {
          value: '#f00',
          name: 'colors-danger',
          path: ['colors','danger'],
          attributes: {
            category: 'colors',
            type: 'danger'
          },
          original: {
            value: '{colors.error}'
          }
        },
        alert: {
          value: '#f00',
          name: 'colors-alert',
          path: ['colors','alert'],
          attributes: {
            category: 'colors',
            type: 'alert'
          },
          original: {
            value: '{colors.error.value}'
          }
        },
      }
    }

    const actual = StyleDictionary.extend({
      tokens,
      platforms: {
        css: {
          transformGroup: `css`
        }
      }
    }).exportPlatform('css');
    expect(actual).toEqual(expected);
  });

  describe('token references without .value', () => {
    const tokens = {
      color: {
        red: { value: '#f00' },
        error: { value: '{color.red}' },
        errorWithValue: { value: '{color.red.value}' },
        danger: { value: '{color.error}' },
        dangerWithValue: { value: '{color.error.value}' },
        dangerErrorValue: { value: '{color.errorWithValue}' }
      }
    }

    const actual = StyleDictionary.extend({
      tokens,
      platforms: {
        css: {
          transformGroup: 'css'
        }
      }
    }).exportPlatform('css');

    it('should work if referenced directly', () => {
      expect(actual.color.error.value).toEqual('#ff0000');
    });
    it('should work if there is a transitive reference', () => {
      expect(actual.color.danger.value).toEqual('#ff0000');
    });
    it('should work if there is a transitive reference with .value', () => {
      expect(actual.color.errorWithValue.value).toEqual('#ff0000');
      expect(actual.color.dangerWithValue.value).toEqual('#ff0000');
      expect(actual.color.dangerErrorValue.value).toEqual('#ff0000');
    });
  });

  describe('non-token references', () => {
    const tokens = {
      nonTokenColor: 'hsl(10,20%,20%)',
      hue: {
        red: '10',
        green: '120',
        blue: '220'
      },
      comment: 'hello',
      color: {
        red: {
          // Note having references as part of the value,
          // either in an object like this, or in an interpolated
          // string like below, requires the use of transitive
          // transforms if you want it to be transformed.
          value: {
            h: '{hue.red}',
            s: '100%',
            l: '50%'
          }
        },
        blue: {
          value: '{nonTokenColor}',
          comment: '{comment}'
        },
        green: {
          value: 'hsl({hue.green}, 50%, 50%)'
        }
      }
    }

    // making the css/color transform transitive so we can be sure the references
    // get resolved properly and transformed.
    const transitiveTransform = Object.assign({},
      StyleDictionary.transform['color/css'],
      {transitive: true}
    );

    const actual = StyleDictionary.extend({
      tokens,
      transform: {
        transitiveTransform
      },
      platforms: {
        css: {
          transforms: [
            'attribute/cti',
            'name/cti/kebab',
            'transitiveTransform'
          ]
        }
      }
    }).exportPlatform('css');

    it('should work if referenced directly', () => {
      expect(actual.color.blue.value).toEqual('#3d2c29');
    });
    it('should work if referenced from a non-value', () => {
      expect(actual.color.blue.comment).toEqual(tokens.comment);
    });
    it('should work if interpolated', () => {
      expect(actual.color.green.value).toEqual('#40bf40');
    });
    it('should work if part of an object value', () => {
      expect(actual.color.red.value).toEqual('#ff2b00');
    });
  });
});
