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
  describe('fileHeader', () => {

    it('should error if name is not a string', () => {
      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          fileHeader: function () {}
        })
      ).toThrow('name must be a string');

      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: 1,
          fileHeader: function () {}
        })
      ).toThrow('name must be a string');

      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: [],
          fileHeader: function () {}
        })
      ).toThrow('name must be a string');

      expect(
        StyleDictionaryExtended.registerFilter.bind(null, {
          name: {},
          matcher: function () {}
        })
      ).toThrow('name must be a string');
    });

    it('should error if fileHeader is not a function', () => {
      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: 'myCustomHeader'
        })
      ).toThrow('fileHeader must be a function');

      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: 'myCustomHeader',
          fileHeader: 1
        })
      ).toThrow('fileHeader must be a function');

      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: 'myCustomHeader',
          fileHeader: 'name'
        })
      ).toThrow('fileHeader must be a function');

      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: 'myCustomHeader',
          fileHeader: []
        })
      ).toThrow('fileHeader must be a function');

      expect(
        StyleDictionaryExtended.registerFileHeader.bind(null, {
          name: 'myCustomHeader',
          fileHeader: {}
        })
      ).toThrow('fileHeader must be a function');
    });

    it('should work if name and matcher are good', () => {
      StyleDictionaryExtended.registerFileHeader({
        name: 'myCustomHeader',
        fileHeader: function() {}
      });
      expect(typeof StyleDictionaryExtended.fileHeader['myCustomHeader']).toBe('function');
    });

    it('should properly pass the registered fileHeader to instances', () => {
      var SDE2 = StyleDictionaryExtended.extend({});
      expect(typeof SDE2.fileHeader['myCustomHeader']).toBe('function');
    });

  });
});
