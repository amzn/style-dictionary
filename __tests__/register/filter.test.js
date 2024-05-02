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
    filter: () => {},
  },
  registerMethod: 'registerFilter',
  prop: 'filters',
  hooks: true,
});

describe('register', () => {
  describe('filter', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if name is not a string', () => {
      expect(() => {
        StyleDictionaryExtended.registerFilter({
          filter: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: 1,
          filter: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: [],
          filter: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: {},
          filter: function () {},
        });
      }).to.throw('name must be a string');
    });

    it('should error if filter is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: 'test',
        });
      }).to.throw('filter must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: 'test',
          filter: 1,
        });
      }).to.throw('filter must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: 'test',
          filter: 'name',
        });
      }).to.throw('filter must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: 'test',
          filter: [],
        });
      }).to.throw('filter must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: 'test',
          filter: {},
        });
      }).to.throw('filter must be a function');
    });

    it('should work if name and filter are good', () => {
      StyleDictionaryExtended.registerFilter({
        name: 'scss',
        filter: function () {},
      });
      expect(typeof StyleDictionaryExtended.hooks.filters['scss']).to.equal('function');
    });

    it('should properly pass the registered filter to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.hooks.filters['scss']).to.equal('function');
    });
  });
});
