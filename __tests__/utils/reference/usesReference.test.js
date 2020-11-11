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

const usesReference = require('../../../lib/utils/references/usesReference');

describe('usesReference()', () => {
  test('returns false for non-strings', () => {
    expect(usesReference(42)).toBe(false);
  });

  test('returns false if value uses no reference', () => {
    expect(usesReference('foo.bar')).toBe(false);
  });

  test('returns true if value is a reference', () => {
    expect(usesReference('{foo.bar}')).toBe(true);
  });

  test('returns true if value uses a reference', () => {
    expect(usesReference('baz {foo.bar}')).toBe(true);
  });

  describe('with custom options', () => {
    test('returns true if value is reference', () => {
      const customOpts = {
        opening_character: '(',
        closing_character: ')',
        separator: '|'
      };

      expect(usesReference('(foo|bar)', customOpts)).toBe(true);
    });
  });
});
