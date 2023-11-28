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
  describe('fileHeader', async () => {
    const StyleDictionaryExtended = new StyleDictionary({});

    it('should error if name is not a string', () => {
      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          fileHeader: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: 1,
          fileHeader: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: [],
          fileHeader: function () {},
        });
      }).to.throw('name must be a string');

      expect(() => {
        StyleDictionaryExtended.registerFilter({
          name: {},
          matcher: function () {},
        });
      }).to.throw('name must be a string');
    });

    it('should error if fileHeader is not a function', () => {
      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: 'myCustomHeader',
        });
      }).to.throw('fileHeader must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: 'myCustomHeader',
          fileHeader: 1,
        });
      }).to.throw('fileHeader must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: 'myCustomHeader',
          fileHeader: 'name',
        });
      }).to.throw('fileHeader must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: 'myCustomHeader',
          fileHeader: [],
        });
      }).to.throw('fileHeader must be a function');

      expect(() => {
        StyleDictionaryExtended.registerFileHeader({
          name: 'myCustomHeader',
          fileHeader: {},
        });
      }).to.throw('fileHeader must be a function');
    });

    it('should work if name and matcher are good', () => {
      StyleDictionaryExtended.registerFileHeader({
        name: 'myCustomHeader',
        fileHeader: function () {},
      });
      expect(typeof StyleDictionaryExtended.fileHeader['myCustomHeader']).to.equal('function');
    });

    it('should properly pass the registered fileHeader to instances', async () => {
      const SDE2 = await StyleDictionaryExtended.extend({});
      expect(typeof SDE2.fileHeader['myCustomHeader']).to.equal('function');
    });
  });
});
