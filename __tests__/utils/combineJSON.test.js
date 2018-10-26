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

const path = require('path');
const combineJSON = require('../../lib/utils/combineJSON');

describe('utils', () => {
  describe('combineJSON', () => {
    it('should return an object', () => {
      const test = combineJSON(['__tests__/__json_files/*.json']);
      expect(typeof test).toBe('object');
    });

    it('should handle wildcards', () => {
      const test = combineJSON(['__tests__/__json_files/*.json']);
      expect(typeof test).toBe('object');
    });

    it('should handle js modules that export objects', () => {
      const absPath = path.join(process.cwd(), 'test', 'json_files', '*.js');
      const relativePath = '__tests__/__json_files/*.js';
      const test = combineJSON([absPath, relativePath]);
      expect(typeof test).toBe('object');
    });

    it('should do a deep merge', () => {
      const test = combineJSON(['__tests__/__json_files/shallow/*.json'], true);
      expect(test).toHaveProperty('a', 2);
      expect(test.b).toMatchObject({ a: 1, c: 2 });
      expect(test).toHaveProperty('d.e.f.g', 1);
      expect(test).toHaveProperty('d.e.f.h', 2);
    });

    it('should do a shallow merge', () => {
      const test = combineJSON(['__tests__/__json_files/shallow/*.json']);
      expect(test).toHaveProperty('a', 2);
      expect(test.b).toMatchObject({ c: 2 });
      expect(test).toHaveProperty('c', [3, 4]);
      expect(test).not.toHaveProperty('d.e.f.g');
      expect(test).toHaveProperty('d.e.f.h', 2);
    });

    it('should fail on invalid JSON', () => {
      expect(combineJSON.bind(null, ['__tests__/__json_files/broken/*.json'], true)).toThrow(/Failed to load or parse/);
    });

    it('should fail if there is a collision and it is passed a collision function', () => {
      expect(
        combineJSON.bind(null, ['__tests__/__json_files/shallow/*.json'], true, (opts) => {
          expect(opts).toHaveProperty('key', 'a');
          expect(opts.target[opts.key]).toBe(1);
          expect(opts.copy[opts.key]).toBe(2);
          throw new Error('test');
        })
      ).toThrow(/test/);
    });

    it('should support json5', () => {
      const test = combineJSON(['__tests__/__json_files/shallow/*.json5']);
      expect(test).toHaveProperty('json5A', 5);
      expect(test.d).toHaveProperty('json5e', 1);
    });
  });
});
