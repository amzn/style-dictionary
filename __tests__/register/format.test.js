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
    format: () => {},
  },
  registerMethod: 'registerFormat',
  prop: 'formats',
});

describe('register', () => {
  describe('format', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if name is not a string', () => {
      const errorMessage = `Can't register format; format.name must be a string`;
      expect(() => {
        StyleDictionaryExtended.registerFormat({
          format: function () {},
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: 1,
          format: function () {},
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: [],
          format: function () {},
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: {},
          format: function () {},
        });
      }).to.throw(errorMessage);
    });

    it('should error if format is not a function', () => {
      const errorMessage = `Can't register format; format.format must be a function`;
      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: 'test',
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: 'test',
          format: 1,
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: 'test',
          format: 'name',
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: 'test',
          format: [],
        });
      }).to.throw(errorMessage);

      expect(() => {
        StyleDictionaryExtended.registerFormat({
          name: 'test',
          format: {},
        });
      }).to.throw(errorMessage);
    });

    it('should work if name and format are good', () => {
      StyleDictionaryExtended.registerFormat({
        name: 'scss',
        format: function () {},
      });
      expect(typeof StyleDictionaryExtended.hooks.formats['scss']).to.equal('function');
    });

    it('should properly pass the registered format to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.hooks.formats['scss']).to.equal('function');
    });
  });
});
