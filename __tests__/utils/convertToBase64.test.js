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

var convertToBase64 = require('../../lib/utils/convertToBase64.js');

describe('utils', () => {
  describe('convertToBase64', () => {
    it('should error if filePath isnt a string', () => {
      expect(
        convertToBase64.bind(null)
      ).toThrow('filePath name must be a string');
      expect(
        convertToBase64.bind(null, [])
      ).toThrow('filePath name must be a string');
      expect(
        convertToBase64.bind(null, {})
      ).toThrow('filePath name must be a string');
    });

    it('should error if filePath isnt a file', () => {
      expect(
        convertToBase64.bind(null, 'foo')
      ).toThrow("ENOENT: no such file or directory, open 'foo'");
    });

    it('should return a string', () => {
      expect(typeof convertToBase64('__tests__/__configs/test.json')).toBe('string');
    });

    it('should be a valid base64 string', () => {
      expect(convertToBase64('__tests__/__json_files/simple.json'))
        .toEqual('ewogICJmb28iOiAiYmFyIiwKICAiYmFyIjogIntmb299Igp9');
    });
  });
});
