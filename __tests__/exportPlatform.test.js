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
import { stubMethod, restore } from 'hanbi';
import StyleDictionary from 'style-dictionary';
import { usesReferences } from 'style-dictionary/utils';
import { fileToJSON, cleanConsoleOutput } from './__helpers.js';

const config = fileToJSON('__tests__/__configs/test.json');

describe('exportPlatform', () => {
  let styleDictionary;
  beforeEach(async () => {
    restore();
    styleDictionary = new StyleDictionary(config);
    await styleDictionary.hasInitialized;
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
        filter: function (prop) {
          return !!prop.original.transformColor;
        },
        transform: function (prop) {
          return prop.value + '-darker';
        },
      });
      const dictionary = await StyleDictionaryExtended.exportPlatform('test');
      expect(dictionary.color.button.active.value).to.equal('#0077cc-darker');
      expect(dictionary.color.button.hover.value).to.equal('#0077cc-darker-darker');
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
        hooks: {
          transforms: {
            transitive: {
              type: 'value',
              transitive: true,
              transform: (token) => `${token.value}-bar`,
            },
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

    it('should apply transitive transforms with references nested beyond "value" prop, so transforms can consume the resolved value', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        tokens: {
          a: {
            value: 0.5,
          },
          b: {
            value: '#fff',
            type: 'color',
            $extensions: {
              'bar.foo': {
                darken: '{a}',
              },
            },
          },
        },
        platforms: {
          test: {
            transforms: ['color/darken'],
          },
        },
      });
      StyleDictionaryExtended.registerTransform({
        type: 'value',
        name: 'color/darken',
        transitive: true,
        filter: (token) => token.type === 'color',
        transform: (token) => {
          const darkenMod = token?.$extensions?.['bar.foo']?.darken;
          if (usesReferences(darkenMod)) {
            // defer this transform, because our darken value is a ref
            return undefined;
          }
          if (typeof darkenMod === 'number') {
            // don't actually darken, just return darken value for this test
            return '#000';
          }
          return token.value;
        },
      });
      const dictionary = await StyleDictionaryExtended.exportPlatform('test');
      expect(dictionary.b.value).to.equal('#000');
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

  it('should handle .value and non .value references per the DTCG spec', async () => {
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
          original: {
            value: '#f00',
          },
          attributes: {
            category: 'colors',
            type: 'red',
          },
        },
        error: {
          value: '#f00',
          name: 'colors-error',
          path: ['colors', 'error'],
          original: {
            value: '{colors.red}',
          },
          attributes: {
            category: 'colors',
            type: 'error',
          },
        },
        danger: {
          value: '#f00',
          name: 'colors-danger',
          path: ['colors', 'danger'],
          original: {
            value: '{colors.error}',
          },
          attributes: {
            category: 'colors',
            type: 'danger',
          },
        },
        alert: {
          value: '#f00',
          name: 'colors-alert',
          path: ['colors', 'alert'],
          original: {
            value: '{colors.error.value}',
          },
          attributes: {
            category: 'colors',
            type: 'alert',
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
        red: { value: '#f00', type: 'color' },
        error: { value: '{color.red}', type: 'color' },
        errorWithValue: { value: '{color.red.value}', type: 'color' },
        danger: { value: '{color.error}', type: 'color' },
        dangerWithValue: { value: '{color.error.value}', type: 'color' },
        dangerErrorValue: { value: '{color.errorWithValue}', type: 'color' },
      },
    };

    const sd = new StyleDictionary({
      tokens,
      platforms: {
        css: {
          transformGroup: 'css',
        },
      },
    });
    const actual = await sd.exportPlatform('css');

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
          type: 'color',
        },
        blue: {
          value: '{nonTokenColor}',
          comment: '{comment}',
          type: 'color',
        },
        green: {
          value: 'hsl({hue.green}, 50%, 50%)',
          type: 'color',
        },
      },
    };
    // making the css/color transform transitive so we can be sure the references
    // get resolved properly and transformed.
    const transitiveTransform = Object.assign({}, StyleDictionary.hooks.transforms['color/css'], {
      transitive: true,
    });

    const sd = new StyleDictionary({
      tokens,
      hooks: {
        transforms: {
          transitiveTransform,
        },
      },
      platforms: {
        css: {
          transforms: ['name/kebab', 'transitiveTransform'],
        },
      },
    });
    const actual = await sd.exportPlatform('css');

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

  describe('reference warnings', () => {
    const errorMessage = (amount = 1) => `Reference Errors:
Some token references (${amount}) could not be found.
Use log.verbosity "verbose" or use CLI option --verbose for more details.`;
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

      const sd = new StyleDictionary({
        tokens,
        platforms,
      });

      await expect(sd.exportPlatform('css')).to.eventually.be.rejectedWith(errorMessage());
    });

    it('should throw if there are circular reference errors', async () => {
      const tokens = {
        a: '{b}',
        b: '{a}',
      };

      const sd = new StyleDictionary({
        tokens,
        platforms,
      });
      await expect(sd.exportPlatform('css')).to.eventually.be.rejectedWith(errorMessage());
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
      const sd = new StyleDictionary({
        tokens,
        platforms,
      });
      await expect(sd.exportPlatform('css')).to.eventually.be.rejectedWith(errorMessage(4));
    });
  });

  describe('CSS shorthand transforms integration', () => {
    describe('typography', () => {
      it('should warn the user about CSS Font shorthand unknown properties', async () => {
        const logStub = stubMethod(console, 'log');
        const sd = new StyleDictionary({
          tokens: {
            foo: {
              bar: {
                value: {
                  fontWeight: '500',
                  fontSize: '20px',
                  letterSpacing: 'normal',
                  paragraphSpacing: '20px',
                  textColor: '#000000',
                },
                type: 'typography',
              },
            },
          },
          platforms: {
            css: {
              transforms: ['typography/css/shorthand'],
            },
          },
        });

        await sd.exportPlatform('css');
        console.warn(cleanConsoleOutput(logStub.firstCall.args[0]));

        expect(cleanConsoleOutput(logStub.firstCall.args[0])).to.equal(`
Unknown CSS Font Shorthand properties found for 1 tokens, CSS output for Font values will be missing some typography token properties as a result:
Use log.verbosity "verbose" or use CLI option --verbose for more details.
`);

        sd.log.verbosity = 'verbose';
        await sd.exportPlatform('css', { cache: false });

        expect(cleanConsoleOutput(Array.from(logStub.calls)[1].args[0])).to.equal(`
Unknown CSS Font Shorthand properties found for 1 tokens, CSS output for Font values will be missing some typography token properties as a result:

letterSpacing, paragraphSpacing, textColor for token at foo.bar
`);

        sd.tokens.foo.bar.filePath = '/tokens.json';
        await sd.exportPlatform('css', { cache: false });

        expect(cleanConsoleOutput(Array.from(logStub.calls)[2].args[0])).to.equal(`
Unknown CSS Font Shorthand properties found for 1 tokens, CSS output for Font values will be missing some typography token properties as a result:

letterSpacing, paragraphSpacing, textColor for token at foo.bar in /tokens.json
`);

        sd.log.verbosity = 'silent';
        await sd.exportPlatform('css', { cache: false });
        expect(Array.from(logStub.calls)[3]).to.be.undefined;

        sd.log.verbosity = 'default';
        sd.log.warnings = 'disabled';
        await sd.exportPlatform('css', { cache: false });
        expect(Array.from(logStub.calls)[3]).to.be.undefined;

        sd.log.warnings = 'error';
        await expect(sd.exportPlatform('css', { cache: false })).to.be.eventually.rejectedWith(`
Unknown CSS Font Shorthand properties found for 1 tokens, CSS output for Font values will be missing some typography token properties as a result:
Use log.verbosity "verbose" or use CLI option --verbose for more details.
`);
      });

      it('should properly transform typography tokens that are references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: '{foo}',
              type: 'typography',
            },
            foo: {
              value: {
                fontWeight: '500',
                fontSize: '20px',
                letterSpacing: 'normal',
                paragraphSpacing: '20px',
                textColor: '#000000',
              },
              type: 'typography',
            },
          },
          platforms: {
            css: {
              transforms: ['typography/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.bar.value).to.equal('500 20px sans-serif');
      });

      it('should properly transform typography tokens that contain references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: '500',
              type: 'fontWeight',
            },
            foo: {
              value: {
                fontWeight: '{bar}',
                fontSize: '20px',
                letterSpacing: 'normal',
                paragraphSpacing: '20px',
                textColor: '#000000',
              },
              type: 'typography',
            },
          },
          platforms: {
            css: {
              transforms: ['typography/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.foo.value).to.equal('500 20px sans-serif');
      });
    });

    describe('border', () => {
      it('should properly transform typography tokens that are references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: '{foo}',
              type: 'border',
            },
            foo: {
              value: {
                style: 'dashed',
                color: '#000',
                width: '2px',
              },
              type: 'border',
            },
          },
          platforms: {
            css: {
              transforms: ['border/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.bar.value).to.equal('2px dashed #000');
      });

      it('should properly transform typography tokens that contain references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: 'dashed',
              type: 'strokeStyle',
            },
            foo: {
              value: {
                style: '{bar}',
                color: '#000',
                width: '2px',
              },
              type: 'border',
            },
          },
          platforms: {
            css: {
              transforms: ['border/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.foo.value).to.equal('2px dashed #000');
      });
    });

    describe('transition', () => {
      it('should properly transform transition tokens that are references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: '{foo}',
              type: 'transition',
            },
            foo: {
              value: {
                duration: '200ms',
                delay: '0ms',
                timingFunction: [0.5, 0, 1, 1],
              },
              type: 'transition',
            },
          },
          platforms: {
            css: {
              transforms: ['cubicBezier/css', 'transition/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.bar.value).to.equal('200ms cubic-bezier(0.5, 0, 1, 1) 0ms');
      });

      it('should properly transform transition tokens that contain references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: [0.5, 0, 1, 1],
              type: 'cubicBezier',
            },
            foo: {
              value: {
                duration: '200ms',
                delay: '0ms',
                timingFunction: '{bar}',
              },
              type: 'transition',
            },
          },
          platforms: {
            css: {
              transforms: ['cubicBezier/css', 'transition/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.foo.value).to.equal('200ms cubic-bezier(0.5, 0, 1, 1) 0ms');
      });
    });

    describe('shadow', () => {
      it('should properly transform typography tokens that are references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: '{foo}',
              type: 'shadow',
            },
            foo: {
              value: {
                offsetX: '2px',
                offsetY: '4px',
                blur: '10px',
                color: '#000',
              },
              type: 'shadow',
            },
          },
          platforms: {
            css: {
              transforms: ['shadow/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.bar.value).to.equal('2px 4px 10px #000');
      });

      it('should properly transform typography tokens that contain references', async () => {
        const sd = new StyleDictionary({
          tokens: {
            bar: {
              value: '#000',
              type: 'color',
            },
            foo: {
              value: [
                {
                  offsetX: '2px',
                  offsetY: '4px',
                  blur: '10px',
                  color: '{bar}',
                },
                {
                  offsetX: '4px',
                  offsetY: '8px',
                  blur: '12px',
                  color: '{bar}',
                },
              ],
              type: 'shadow',
            },
          },
          platforms: {
            css: {
              transforms: ['shadow/css/shorthand'],
            },
          },
        });

        const transformed = await sd.exportPlatform('css');
        expect(transformed.foo.value).to.equal('2px 4px 10px #000, 4px 8px 12px #000');
      });
    });
  });

  describe('DTCG forward compatibility', () => {
    it('should allow using $value instead of value', async () => {
      const sd = new StyleDictionary({
        tokens: {
          $type: 'dimension',
          dimensions: {
            sm: {
              $value: '5',
            },
            md: {
              $value: '10',
              value: '2000',
            },
            value: {
              $value: '20',
            },
            nested: {
              value: {
                deep: {
                  $value: '30',
                },
              },
            },
          },
          reftest: { $value: '{zero.$value}' },
          zero: { $value: '0' },
          reftest2: { $value: '{one}' },
          one: { $value: '1' },
        },
        hooks: {
          transforms: {
            'custom/add/px': {
              type: 'value',
              filter: (token) => {
                return token.$type === 'dimension';
              },
              transform: (token) => {
                return `${sd.usesDtcg ? token.$value : token.value}px`;
              },
            },
          },
        },
        platforms: {
          css: {
            transforms: ['name/kebab', 'custom/add/px'],
          },
        },
      });

      const tokens = await sd.exportPlatform('css');

      expect(tokens.dimensions.sm.$value).to.equal('5px');
      expect(tokens.dimensions.md.$value).to.equal('10px');

      // unaffected, because "metadata" property
      expect(tokens.dimensions.md.value).to.equal('2000');

      // considers "value" a token name here
      expect(tokens.dimensions.value.$value).to.equal('20px');

      // considers "value" a token group here
      expect(tokens.dimensions.nested.value.deep.$value).to.equal('30px');

      expect(tokens.reftest.$value).to.equal('0px');
      expect(tokens.reftest2.$value).to.equal('1px');
    });
  });
});
