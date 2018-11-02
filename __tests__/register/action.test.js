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
  describe('action', () => {

    it('should error if name is not a string', () => {
      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          do: function() {}
        })
      ).toThrow('name must be a string');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: 1,
          do: function() {}
        })
      ).toThrow('name must be a string');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: [],
          do: function() {}
        })
      ).toThrow('name must be a string');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: {},
          do: function() {}
        })
      ).toThrow('name must be a string');
    });

    it('should error if do is not a function', () => {
      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: 'test'
        })
      ).toThrow('do must be a function');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: 'test',
          do: 1
        })
      ).toThrow('do must be a function');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: 'test',
          do: 'name'
        })
      ).toThrow('do must be a function');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: 'test',
          do: []
        })
      ).toThrow('do must be a function');

      expect(
        StyleDictionaryExtended.registerAction.bind(null, {
          name: 'test',
          do: {}
        })
      ).toThrow('do must be a function');
    });

    it('should work if name and do are good', () => {
      StyleDictionaryExtended.registerAction({
        name: 'scss',
        do: function() {}
      });
      expect(typeof StyleDictionaryExtended.action['scss'].do).toBe('function');
    });

    it('should handle an undo function', () => {
      StyleDictionaryExtended.registerAction({
        name: 'scss',
        do: function() {},
        undo: function() {}
      });
      expect(typeof StyleDictionaryExtended.action['scss'].undo).toBe('function');
    });

    it('should properly pass the registered format to instances', () => {
      var SDE2 = StyleDictionaryExtended.extend({});
      expect(typeof SDE2.action['scss'].do).toBe('function');
    });

  });
});
