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

describe('register', () => {
  describe('parser', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if pattern is not a regex', () => {
      expect(() => {
        StyleDictionaryExtended.registerParser({
          parse: function () {},
        });
      }).to.throw('pattern must be a regular expression');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: 1,
          parse: function () {},
        });
      }).to.throw('pattern must be a regular expression');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: [],
          parse: function () {},
        });
      }).to.throw('pattern must be a regular expression');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: {},
          parse: function () {},
        });
      }).to.throw('pattern must be a regular expression');
    });

    it('should error if parser is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: /$.json/,
        });
      }).to.throw('parse must be a function');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: /$.json/,
          parse: 1,
        });
      }).to.throw('parse must be a function');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: /$.json/,
          parse: 'name',
        });
      }).to.throw('parse must be a function');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: /$.json/,
          parse: [],
        });
      }).to.throw('parse must be a function');

      expect(() => {
        StyleDictionaryExtended.registerParser({
          pattern: /$.json/,
          parse: {},
        });
      }).to.throw('parse must be a function');
    });

    it('should work if pattern and parser are good', () => {
      StyleDictionaryExtended.registerParser({
        pattern: /$.json/,
        parse: function () {},
      });
      expect(typeof StyleDictionaryExtended.parsers[0].parse).to.equal('function');
    });

    it('should properly pass the registered filter to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.parsers[0].parse).to.equal('function');
    });
  });
});
