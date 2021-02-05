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
  describe('parser', () => {

    it('should error if pattern is not a regex', () => {
      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          parse: function () {}
        })
      ).toThrow('pattern must be a regular expression');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: 1,
          parse: function () {}
        })
      ).toThrow('pattern must be a regular expression');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: [],
          parse: function () {}
        })
      ).toThrow('pattern must be a regular expression');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: {},
          parse: function () {}
        })
      ).toThrow('pattern must be a regular expression');
    });

    it('should error if parser is not a function', () => {
      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: /$.json/
        })
      ).toThrow('parse must be a function');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: /$.json/,
          parse: 1
        })
      ).toThrow('parse must be a function');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: /$.json/,
          parse: 'name'
        })
      ).toThrow('parse must be a function');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: /$.json/,
          parse: []
        })
      ).toThrow('parse must be a function');

      expect(
        StyleDictionaryExtended.registerParser.bind(null, {
          pattern: /$.json/,
          parse: {}
        })
      ).toThrow('parse must be a function');
    });

    it('should work if pattern and parser are good', () => {
      StyleDictionaryExtended.registerParser({
        pattern: /$.json/,
        parse: function() {}
      });
      expect(typeof StyleDictionaryExtended.parsers[0].parse).toBe('function');
    });

    it('should properly pass the registered filter to instances', () => {
      var SDE2 = StyleDictionaryExtended.extend({});
      expect(typeof SDE2.parsers[0].parse).toBe('function');
    });

  });
});
