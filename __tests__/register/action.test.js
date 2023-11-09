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
  describe('action', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if name is not a string', () => {
      expect(() => {
        StyleDictionaryExtended.registerAction({
          do: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: 1,
          do: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: [],
          do: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: {},
          do: function () {},
        });
      }).to.throw('name must be a string');
    });

    it('should error if do is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: 'test',
        });
      }).to.throw('do must be a function');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: 'test',
          do: 1,
        });
      }).to.throw('do must be a function');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: 'test',
          do: 'name',
        });
      }).to.throw('do must be a function');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: 'test',
          do: [],
        });
      }).to.throw('do must be a function');

      expect(() => {
        StyleDictionaryExtended.registerAction({
          name: 'test',
          do: {},
        });
      }).to.throw('do must be a function');
    });

    it('should work if name and do are good', () => {
      StyleDictionaryExtended.registerAction({
        name: 'scss',
        do: function () {},
      });
      expect(typeof StyleDictionaryExtended.action['scss'].do).to.equal('function');
    });

    it('should handle an undo function', () => {
      StyleDictionaryExtended.registerAction({
        name: 'scss',
        do: function () {},
        undo: function () {},
      });
      expect(typeof StyleDictionaryExtended.action['scss'].undo).to.equal('function');
    });

    it('should properly pass the registered format to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.action['scss'].do).to.equal('function');
    });
  });
});
