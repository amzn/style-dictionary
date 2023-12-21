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
import { expect } from 'chai';
import StyleDictionary from 'style-dictionary';
import { usesReferences } from 'style-dictionary/utils';
import { fileToJSON } from './__helpers.js';

const config = fileToJSON('__tests__/__configs/test.json');

describe('exportPlatform', () => {
  let styleDictionary;
  beforeEach(() => {
    styleDictionary = new StyleDictionary(config);
  });

  it('should throw if not given a platform', async () => {
    await expect(styleDictionary.exportPlatform()).to.eventually.be.rejectedWith(
      'Please supply a valid platform',
    );
  });

  it('should throw if not given a proper platform', async () => {
    await expect(styleDictionary.exportPlatform('foo')).to.eventually.be.rejectedWith(
      'Please supply a valid platform',
    );
  });

  it('should not throw if given a proper platform', async () => {
    await expect(styleDictionary.exportPlatform('web')).to.eventually.be.fulfilled;
  });

  it('should return an object', async () => {
    const dictionary = await styleDictionary.exportPlatform('web');
    expect(typeof dictionary).to.equal('object');
  });

  it('should have the same structure as the original tokens', async () => {
    const dictionary = await styleDictionary.exportPlatform('web');
    expect(Object.keys(dictionary)).to.eql(Object.keys(styleDictionary.tokens));
  });

  it('should have resolved references', async () => {
    const dictionary = await styleDictionary.exportPlatform('web');
    expect(dictionary.color.font.link.value).to.eql(dictionary.color.base.blue['100'].value);
  });

  it('should have applied transforms', async () => {
    const dictionary = await styleDictionary.exportPlatform('web');
    expect(dictionary.size.padding.base.value.endsWith('px')).to.be.true;
  });

  describe('transitive transforms', () => {
    it('should have applied transforms for props with refs in it', async () => {
      const StyleDictionaryExtended = await styleDictionary.extend({
        platforms: {
          test: {
            transforms: ['color/css', 'color/darken'],
          },
        },
      });
      StyleDictionary.registerTransform({
        type: 'value',
        name: 'color/darken',
        transitive: true,
        matcher: function (prop) {
          return !!prop.original.transformColor;
        },
        transformer: function (prop) {
          return prop.value + '-darker';
        },
      });
      const dictionary = await StyleDictionaryExtended.exportPlatform('test');
      expect(dictionary.color.button.active.value).to.equal('#0077CC-darker');
      expect(dictionary.color.button.hover.value).to.equal('#0077CC-darker-darker');
    });

    it('should have transitive transforms applied without .value in references', async () => {
      const sd = new StyleDictionary({
        tokens: {
          one: { value: 'foo' },
          two: { value: '{one.value}' },
          three: { value: '{two}' },
          four: { value: '{one}' },
          five: { value: '{four.value}' },
          six: { value: '{one}' },
          seven: { value: '{six}' },
          eight: { value: '{one.value}' },
          nine: { value: '{eight.value}' },
        },
        transform: {
          transitive: {
            type: 'value',
            transitive: true,
            transformer: (token) => `${token.value}-bar`,
          },
        },
        platforms: {
          test: {
            transforms: ['transitive'],
          },
        },
      });
      const dictionary = await sd.exportPlatform('test');
      expect(dictionary.one.value).to.equal('foo-bar');
      expect(dictionary.two.value).to.equal('foo-bar-bar');
      expect(dictionary.three.value).to.equal('foo-bar-bar-bar');
      expect(dictionary.four.value).to.equal('foo-bar-bar');
      expect(dictionary.five.value).to.equal('foo-bar-bar-bar');
      expect(dictionary.six.value).to.equal('foo-bar-bar');
      expect(dictionary.seven.value).to.equal('foo-bar-bar-bar');
      expect(dictionary.eight.value).to.equal('foo-bar-bar');
      expect(dictionary.nine.value).to.equal('foo-bar-bar-bar');
    });
  });

  it('should not have mutated the original tokens', async () => {
    const dictionary = await styleDictionary.exportPlatform('web');
    expect(dictionary.color.font.link.value).to.not.equal(
      styleDictionary.tokens.color.font.link.value,
    );
    expect(styleDictionary.tokens.size.padding.base.value.endsWith('px')).to.be.false;
  });
  // Make sure when we perform transforms and resolve references
  // we don't mutate the original object added to the property.
  it('tokens should have original value untouched', async () => {
    const dictionary = await styleDictionary.exportPlatform('web');
    const tokens = fileToJSON('__tests__/__tokens/colors.json');
    expect(dictionary.color.font.link.original.value).to.equal(tokens.color.font.link.value);
  });

  it('should not mutate original value if value is an object', async () => {
    const sd = new StyleDictionary({
      tokens: {
        color: {
          red: {
            value: {
              h: '{hue.red}',
              s: 50,
              l: 50,
            },
          },
        },
        hue: {
          red: 20,
        },
      },
      platforms: {
        web: {
          transformGroup: 'web',
        },
      },
    });
    const dictionary = await sd.exportPlatform('web');
    expect(dictionary.color.red.original.value.h).to.equal('{hue.red}');
    expect(dictionary.color.red.value.h).to.equal(20);
  });

  it('should handle .value and non .value references per the W3C spec', async () => {
    const tokens = {
      colors: {
        red: { value: '#f00' },
        error: { value: '{colors.red}' },
        danger: { value: '{colors.error}' },
        alert: { value: '{colors.error.value}' },
      },
    };
    const expected = {
      colors: {
        red: {
          value: '#f00',
          name: 'colors-red',
          path: ['colors', 'red'],
          attributes: {
            category: 'colors',
            type: 'red',
          },
          original: {
            value: '#f00',
          },
        },
        error: {
          value: '#f00',
          name: 'colors-error',
          path: ['colors', 'error'],
          attributes: {
            category: 'colors',
            type: 'error',
          },
          original: {
            value: '{colors.red}',
          },
        },
        danger: {
          value: '#f00',
          name: 'colors-danger',
          path: ['colors', 'danger'],
          attributes: {
            category: 'colors',
            type: 'danger',
          },
          original: {
            value: '{colors.error}',
          },
        },
        alert: {
          value: '#f00',
          name: 'colors-alert',
          path: ['colors', 'alert'],
          attributes: {
            category: 'colors',
            type: 'alert',
          },
          original: {
            value: '{colors.error.value}',
          },
        },
      },
    };
    const actual = await new StyleDictionary({
      tokens,
      platforms: {
        css: {
          transformGroup: `css`,
        },
      },
    }).exportPlatform('css');
    expect(actual).to.eql(expected);
  });

  describe('token references without .value', async () => {
    const tokens = {
      color: {
        red: { value: '#f00' },
        error: { value: '{color.red}' },
        errorWithValue: { value: '{color.red.value}' },
        danger: { value: '{color.error}' },
        dangerWithValue: { value: '{color.error.value}' },
        dangerErrorValue: { value: '{color.errorWithValue}' },
      },
    };
    const dict = new StyleDictionary({
      tokens,
      platforms: {
        css: {
          transformGroup: 'css',
        },
      },
    });
    const actual = await dict.exportPlatform('css');

    it('should work if referenced directly', () => {
      expect(actual.color.error.value).to.equal('#ff0000');
    });

    it('should work if there is a transitive reference', () => {
      expect(actual.color.danger.value).to.equal('#ff0000');
    });

    it('should work if there is a transitive reference with .value', () => {
      expect(actual.color.errorWithValue.value).to.equal('#ff0000');
      expect(actual.color.dangerWithValue.value).to.equal('#ff0000');
      expect(actual.color.dangerErrorValue.value).to.equal('#ff0000');
    });
  });

  describe('non-token references', async () => {
    const tokens = {
      nonTokenColor: 'hsl(10,20%,20%)',
      hue: {
        red: '10',
        green: '120',
        blue: '220',
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
            l: '50%',
          },
        },
        blue: {
          value: '{nonTokenColor}',
          comment: '{comment}',
        },
        green: {
          value: 'hsl({hue.green}, 50%, 50%)',
        },
      },
    };
    // making the css/color transform transitive so we can be sure the references
    // get resolved properly and transformed.
    const transitiveTransform = Object.assign({}, StyleDictionary.transform['color/css'], {
      transitive: true,
    });
    const dict = new StyleDictionary({
      tokens,
      transform: {
        transitiveTransform,
      },
      platforms: {
        css: {
          transforms: ['attribute/cti', 'name/cti/kebab', 'transitiveTransform'],
        },
      },
    });
    const actual = await dict.exportPlatform('css');
    it('should work if referenced directly', () => {
      expect(actual.color.blue.value).to.equal('#3d2c29');
    });
    it('should work if referenced from a non-value', () => {
      expect(actual.color.blue.comment).to.equal(tokens.comment);
    });
    it('should work if interpolated', () => {
      expect(actual.color.green.value).to.equal('#40bf40');
    });
    it('should work if part of an object value', () => {
      expect(actual.color.red.value).to.equal('#ff2b00');
    });
  });
});

describe('reference warnings', () => {
  const errorMessage = `Problems were found when trying to resolve property references`;
  const platforms = {
    css: {
      transformGroup: `css`,
    },
  };

  it('should throw if there are simple property reference errors', async () => {
    const tokens = {
      a: '#ff0000',
      b: '{c}',
    };
    const dict = new StyleDictionary({
      tokens,
      platforms,
    });

    await expect(dict.exportPlatform('css')).to.eventually.be.rejectedWith(errorMessage);
  });

  it('should throw if there are circular reference errors', async () => {
    const tokens = {
      a: '{b}',
      b: '{a}',
    };
    const dict = new StyleDictionary({
      tokens,
      platforms,
    });
    await expect(dict.exportPlatform('css')).to.eventually.be.rejectedWith(errorMessage);
  });

  it('should throw if there are complex property reference errors', async () => {
    const tokens = {
      color: {
        core: {
          red: { valuer: '#ff0000' }, // notice misspelling
          blue: { 'value:': '#0000ff' },
        },
        danger: { value: '{color.core.red.value}' },
        warning: { value: '{color.base.red.valuer}' },
        info: { value: '{color.core.blue.value}' },
        error: { value: '{color.danger.value}' },
      },
    };
    const dict = new StyleDictionary({ tokens, platforms });
    await expect(dict.exportPlatform('css')).to.eventually.be.rejectedWith(errorMessage);
  });
});
