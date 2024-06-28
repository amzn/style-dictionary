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
import { registerSuite } from './register.suite.js';

registerSuite({
  config: {
    pattern: /\.json/g,
    parser: () => {},
  },
  registerMethod: 'registerParser',
  prop: 'parsers',
});

describe('register', () => {
  describe('parser', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if name is not a string', () => {
      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: /$.json/,
          parser: function () {},
        });
      }).to.throw("Can't register parser; parser.name must be a string");

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: {},
          pattern: /$.json/,
          parser: function () {},
        });
      }).to.throw("Can't register parser; parser.name must be a string");
    });

    it('should error if pattern is not a regex', () => {
      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          parser: function () {},
        });
      }).to.throw('pattern must be a regular expression');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: 1,
          parser: function () {},
        });
      }).to.throw('pattern must be a regular expression');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: [],
          parser: function () {},
        });
      }).to.throw('pattern must be a regular expression');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: {},
          parser: function () {},
        });
      }).to.throw('pattern must be a regular expression');
    });

    it('should error if parser is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: /$.json/,
        });
      }).to.throw("Can't register parser; parser.parser must be a function");

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: /$.json/,
          parser: 1,
        });
      }).to.throw("Can't register parser; parser.parser must be a function");

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: /$.json/,
          parser: 'name',
        });
      }).to.throw("Can't register parser; parser.parser must be a function");

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: /$.json/,
          parser: [],
        });
      }).to.throw("Can't register parser; parser.parser must be a function");

      expect(() => {
        StyleDictionaryExtended.registerParser({
          name: 'json-parser',
          pattern: /$.json/,
          parser: {},
        });
      }).to.throw("Can't register parser; parser.parser must be a function");
    });

    it('should work if pattern and parser are good', () => {
      StyleDictionaryExtended.registerParser({
        name: 'json-parser',
        pattern: /$.json/,
        parser: function () {},
      });
      expect(typeof StyleDictionaryExtended.hooks.parsers['json-parser'].parser).to.equal(
        'function',
      );
    });

    it('should properly pass the registered filter to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.hooks.parsers['json-parser'].parser).to.equal('function');
    });
  });
});
