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

var StyleDictionary = require('../../index');
var StyleDictionaryExtended = StyleDictionary.extend({});

describe('register', () => {
  describe('format', () => {

    it('should error if name is not a string', () => {
      const errorMessage = `Can't register format; format.name must be a string`
      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          formatter: function() {}
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: 1,
          formatter: function() {}
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: [],
          formatter: function() {}
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: {},
          formatter: function() {}
        })
      ).toThrow(errorMessage);
    });

    it('should error if format is not a function', () => {
      const errorMessage = `Can't register format; format.formatter must be a function`
      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: 'test'
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: 'test',
          formatter: 1
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: 'test',
          formatter: 'name'
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: 'test',
          formatter: []
        })
      ).toThrow(errorMessage);

      expect(
        StyleDictionaryExtended.registerFormat.bind(null, {
          name: 'test',
          formatter: {}
        })
      ).toThrow(errorMessage);
    });

    it('should work if name and format are good', () => {
      StyleDictionaryExtended.registerFormat({
        name: 'scss',
        formatter: function() {}
      });
      expect(typeof StyleDictionaryExtended.format['scss']).toBe('function');
    });

    it('should properly pass the registered format to instances', () => {
      var SDE2 = StyleDictionaryExtended.extend({});
      expect(typeof SDE2.format['scss']).toBe('function');
    });

  });
});
