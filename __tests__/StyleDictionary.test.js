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
import { fileToJSON } from './__helpers.js';

function traverseObj(obj, fn) {
  for (let key in obj) {
    fn.apply(this, [obj, key, obj[key]]);
    if (obj[key] && typeof obj[key] === 'object') {
      traverseObj(obj[key], fn);
    }
  }
}

function stripMeta(obj) {
  Object.keys(obj).forEach((key) => {
    if (['attributes', 'name', 'original', 'path'].includes(key)) {
      delete obj[key];
    }
    if (typeof obj[key] === 'object') {
      stripMeta(obj[key]);
    }
  });
  return obj;
}

const test_props = {
  size: {
    padding: {
      tiny: { value: '0' },
    },
  },
};

// extend method is called by StyleDictionary constructor, therefore we're basically testing both things here
describe('StyleDictionary class + extend method', () => {
  it('should accept a string as a path to a JSON5 file', async () => {
    const StyleDictionaryExtended = new StyleDictionary('__tests__/__configs/test.json5');
    await StyleDictionaryExtended.hasInitialized;
    expect(StyleDictionaryExtended).to.have.nested.property('platforms.web');
  });

  it('should accept a string as a path to a JSONC file', async () => {
    const StyleDictionaryExtended = new StyleDictionary('__tests__/__configs/test.jsonc');
    await StyleDictionaryExtended.hasInitialized;
    expect(StyleDictionaryExtended).to.have.nested.property('platforms.web');
  });

  it('should allow for chained extends and not mutate the original', async () => {
    const StyleDictionary1 = new StyleDictionary({
      foo: 'bar',
      bar: 'other',
    });
    const StyleDictionary2 = await StyleDictionary1.extend({
      foo: 'baz',
    });
    const StyleDictionary3 = await (
      await StyleDictionary2.extend({
        foo: 'bar',
      })
    ).extend({
      foo: 'boo',
    });
    expect(StyleDictionary1.foo).to.equal('bar');
    expect(StyleDictionary2.foo).to.equal('baz');
    expect(StyleDictionary3.foo).to.equal('boo');
    // check that the bar prop from SD1 is not lost in SD3
    expect(StyleDictionary3.bar).to.equal('other');
    expect(StyleDictionary).not.to.have.property('foo');
  });

  it(`should not pollute the prototype`, async () => {
    const obj = {};
    // method 1
    new StyleDictionary(JSON.parse('{"__proto__":{"polluted":"yes"}}'));
    // method 2, which executes a deepmerge under the hood
    // this verifies that this deepmerge util is also protected against prototype pollution
    const sd = new StyleDictionary();
    await sd.hasInitialized;
    await sd.extend(JSON.parse('{"__proto__":{"polluted":"yes"}}'));

    // FIXME: method 3, by putting it into a design token, currently not tested
    // for these we use our own deepExtend utility, which must be prototype pollution protected
    // however, we don't actually test this here..

    expect(obj.polluted).to.be.undefined;
  });

  it('should not merge tokens together but rather override on collision', async () => {
    const sd = new StyleDictionary({
      source: [
        '__tests__/__json_files/token-collision-1.json',
        '__tests__/__json_files/token-collision-2.json',
      ],
    });
    await sd.hasInitialized;
    expect(sd.tokens.test.value).to.equal('#ff0000');
    expect(sd.tokens.test.$extensions).to.be.undefined;
  });

  describe('method signature', () => {
    it('should accept a string as a path to a JSON file', () => {
      const StyleDictionaryExtended = new StyleDictionary('__tests__/__configs/test.json');
      expect(StyleDictionaryExtended).to.have.nested.property('platforms.web');
    });

    it('should accept an object as options', () => {
      const config = fileToJSON('__tests__/__configs/test.json');
      const StyleDictionaryExtended = new StyleDictionary(config);
      expect(StyleDictionaryExtended).to.have.nested.property('platforms.web');
    });

    it('should override config props', () => {
      const StyleDictionaryExtended = new StyleDictionary({
        tokens: {
          foo: 'bar',
        },
      });
      expect(StyleDictionaryExtended).to.have.nested.property('tokens.foo', 'bar');
    });
  });

  describe('includes', () => {
    it('should throw if include isnt an array', async () => {
      const sd = new StyleDictionary({ include: {} }, { init: false });
      await expect(sd.init()).to.eventually.be.rejectedWith('include must be an array');
    });

    it('should not update tokens if include glob paths dont resolve to anything', () => {
      const StyleDictionaryExtended = new StyleDictionary({
        include: ['foo'],
      });
      expect(typeof StyleDictionaryExtended.tokens.size).to.equal('undefined');
    });

    it('should properly glob paths', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        include: ['__tests__/__tokens/*.json'],
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(typeof StyleDictionaryExtended.tokens.size.padding.tiny).to.equal('object');
    });

    it('should build the tokens object if an include is given', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        include: ['__tests__/__tokens/paddings.json'],
      });
      const output = fileToJSON('__tests__/__tokens/paddings.json');
      traverseObj(output, (obj) => {
        if (Object.hasOwn(obj, 'value') && !obj.filePath) {
          obj.filePath = '__tests__/__tokens/paddings.json';
          obj.isSource = false;
        }
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended.tokens).to.eql(output);
    });

    it('should override existing tokens if include is given', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        tokens: test_props,
        include: ['__tests__/__tokens/paddings.json'],
      });
      const output = fileToJSON('__tests__/__tokens/paddings.json');
      traverseObj(output, (obj) => {
        if (Object.hasOwn(obj, 'value') && !obj.filePath) {
          obj.filePath = '__tests__/__tokens/paddings.json';
          obj.isSource = false;
        }
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended.tokens).to.eql(output);
    });

    it('should update tokens if there are includes', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        include: ['__tests__/__configs/include.json'],
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(typeof StyleDictionaryExtended.tokens.size.padding.tiny).to.equal('object');
    });

    it('should override existing tokens if there are includes', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        tokens: test_props,
        include: ['__tests__/__configs/include.json'],
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended).to.have.nested.property(
        'tokens.size.padding.tiny.value',
        '3',
      );
    });
  });

  describe('source', () => {
    it('should throw if source isnt an array', async () => {
      const sd = new StyleDictionary({ source: {} }, { init: false });
      await expect(sd.init()).to.eventually.be.rejectedWith('source must be an array');
    });

    it("should not update tokens if source glob paths don't resolve to anything", async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        source: ['foo'],
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(typeof StyleDictionaryExtended.tokens.size).to.equal('undefined');
    });

    it('should build the tokens object if a source is given', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        source: ['__tests__/__tokens/paddings.json'],
      });
      const output = fileToJSON('__tests__/__tokens/paddings.json');
      traverseObj(output, (obj) => {
        if (Object.hasOwn(obj, 'value') && !obj.filePath) {
          obj.filePath = '__tests__/__tokens/paddings.json';
          obj.isSource = true;
        }
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended.tokens).to.eql(output);
    });

    it('should use relative filePaths for the filePath property', async () => {
      const filePath = '__tests__/__tokens/paddings.json';
      const StyleDictionaryExtended = new StyleDictionary({
        source: [filePath],
      });
      const output = fileToJSON('__tests__/__tokens/paddings.json');
      traverseObj(output, (obj) => {
        if (Object.hasOwn(obj, 'value') && !obj.filePath) {
          obj.filePath = filePath;
          obj.isSource = true;
        }
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended.tokens).to.eql(output);
    });

    it('should override existing tokens source is given', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        tokens: test_props,
        source: ['__tests__/__tokens/paddings.json'],
      });
      const output = fileToJSON('__tests__/__tokens/paddings.json');
      traverseObj(output, (obj) => {
        if (Object.hasOwn(obj, 'value') && !obj.filePath) {
          obj.filePath = '__tests__/__tokens/paddings.json';
          obj.isSource = true;
        }
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended.tokens).to.eql(output);
    });
  });

  describe('collisions', () => {
    it('should not throw a collision error if a source file collides with an include', async () => {
      const StyleDictionaryExtended = new StyleDictionary({
        include: ['__tests__/__tokens/paddings.json'],
        source: ['__tests__/__tokens/paddings.json'],
        log: 'error',
      });
      const output = fileToJSON('__tests__/__tokens/paddings.json');
      traverseObj(output, (obj) => {
        if (Object.hasOwn(obj, 'value') && !obj.filePath) {
          obj.filePath = '__tests__/__tokens/paddings.json';
          obj.isSource = true;
        }
      });
      await StyleDictionaryExtended.hasInitialized;
      expect(StyleDictionaryExtended.tokens).to.eql(output);
    });

    it('should throw an error if the collision is in source files and log is set to error', async () => {
      const sd = new StyleDictionary(
        {
          source: ['__tests__/__tokens/paddings.json', '__tests__/__tokens/_paddings.json'],
          log: { warnings: 'error', verbosity: 'verbose' },
        },
        { init: false },
      );
      let error;
      try {
        await sd.init();
      } catch (e) {
        error = e;
      }
      await expect(error.message).to.matchSnapshot();
    });

    it('should throw a brief error if the collision is in source files and log is set to error and verbosity default', async () => {
      const sd = new StyleDictionary(
        {
          source: ['__tests__/__tokens/paddings.json', '__tests__/__tokens/_paddings.json'],
          log: { warnings: 'error' },
        },
        { init: false },
      );
      let error;
      try {
        await sd.init();
      } catch (e) {
        error = e;
      }
      await expect(error.message).to.matchSnapshot();
    });

    it('should throw a warning if the collision is in source files and log is set to warn', async () => {
      const sd = new StyleDictionary(
        {
          source: ['__tests__/__tokens/paddings.json', '__tests__/__tokens/paddings.json'],
          log: 'warn',
        },
        { init: false },
      );
      await expect(sd.init()).to.eventually.be.fulfilled;
    });
  });

  describe('expand object value tokens', () => {
    it('should not expand object value tokens by default', async () => {
      const input = {
        border: {
          type: 'border',
          value: {
            width: '2px',
            style: 'solid',
            color: '#000',
          },
        },
      };
      const sd = new StyleDictionary({
        tokens: input,
      });
      await sd.hasInitialized;
      expect(sd.tokens).to.eql(input);
    });

    it('should allow expanding tokens globally', async () => {
      const input = {
        border: {
          type: 'border',
          value: {
            width: '2px',
            style: 'solid',
            color: '#000',
          },
        },
      };
      const sd = new StyleDictionary({
        tokens: input,
        expand: true,
      });
      await sd.hasInitialized;
      expect(sd.tokens).to.eql({
        border: {
          color: {
            type: 'color',
            value: '#000',
          },
          style: {
            type: 'strokeStyle',
            value: 'solid',
          },
          width: {
            type: 'dimension',
            value: '2px',
          },
        },
      });
    });

    it('should allow expanding tokens on a per platform basis', async () => {
      const input = {
        border: {
          type: 'border',
          value: {
            width: '2px',
            style: 'solid',
            color: '#000',
          },
        },
      };
      const sd = new StyleDictionary({
        tokens: input,
        platforms: {
          css: {
            expand: true,
          },
          js: {},
        },
      });
      await sd.hasInitialized;
      const cssTokens = await sd.exportPlatform('css');
      const jsTokens = await sd.exportPlatform('js');
      expect(stripMeta(cssTokens)).to.eql({
        border: {
          color: {
            type: 'color',
            value: '#000',
          },
          style: {
            type: 'strokeStyle',
            value: 'solid',
          },
          width: {
            type: 'dimension',
            value: '2px',
          },
        },
      });
      expect(stripMeta(jsTokens)).to.eql(input);
    });

    it('should allow combining global expand with per platform expand', async () => {
      const input = {
        border: {
          type: 'border',
          value: {
            width: '2px',
            style: 'solid',
            color: '#000',
          },
        },
        borderTwo: {
          type: 'border',
          value: {
            width: '1px',
            style: 'dashed',
            color: '#ccc',
          },
        },
      };
      const sd = new StyleDictionary({
        tokens: input,
        expand: {
          include: (token) => {
            return token.value.width === '2px';
          },
        },
        platforms: {
          css: {},
          js: {
            expand: {
              typesMap: true,
            },
          },
        },
      });
      await sd.hasInitialized;
      const cssTokens = await sd.exportPlatform('css');
      const jsTokens = await sd.exportPlatform('js');

      expect(stripMeta(cssTokens)).to.eql({
        border: {
          color: {
            type: 'color',
            value: '#000',
          },
          style: {
            type: 'strokeStyle',
            value: 'solid',
          },
          width: {
            type: 'dimension',
            value: '2px',
          },
        },
        borderTwo: input.borderTwo,
      });
      expect(stripMeta(jsTokens)).to.eql({
        border: {
          color: {
            type: 'color',
            value: '#000',
          },
          style: {
            type: 'strokeStyle',
            value: 'solid',
          },
          width: {
            type: 'dimension',
            value: '2px',
          },
        },
        borderTwo: {
          color: {
            type: 'color',
            value: '#ccc',
          },
          style: {
            type: 'strokeStyle',
            value: 'dashed',
          },
          width: {
            type: 'dimension',
            value: '1px',
          },
        },
      });
    });
  });

  describe('DTCG integration', () => {
    it('should allow using $type value on a token group, children inherit, local overrides take precedence', async () => {
      const sd = new StyleDictionary({
        tokens: {
          dimensions: {
            $type: 'dimension',
            sm: {
              $value: '5',
            },
            md: {
              $value: '10',
            },
            nested: {
              deep: {
                lg: {
                  $value: '15',
                },
              },
            },
            nope: {
              $value: '20',
              $type: 'spacing',
            },
          },
        },
        platforms: {
          css: {
            transformGroup: 'css',
          },
        },
      });
      await sd.hasInitialized;

      expect(sd.tokens.dimensions.sm.$type).to.equal('dimension');
      expect(sd.tokens.dimensions.md.$type).to.equal('dimension');
      expect(sd.tokens.dimensions.nested.deep.lg.$type).to.equal('dimension');
      expect(sd.tokens.dimensions.nope.$type).to.equal('spacing');
    });

    it('should detect usage of DTCG draft spec tokens', async () => {
      const sd = new StyleDictionary({
        tokens: {
          datalist: {
            key: { color: { $value: '#222' } },
            value: { color: { $value: '#000' } },
          },
        },
      });
      await sd.hasInitialized;
      expect(sd.usesDtcg).to.be.true;
    });
  });
});
