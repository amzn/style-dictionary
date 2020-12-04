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
  it(`returns false for non-strings`, () => {
    expect(usesReference(42)).toBe(false);
  });

  it(`returns false if value uses no reference`, () => {
    expect(usesReference('foo.bar')).toBe(false);
  });

  it(`returns true if value is a reference`, () => {
    expect(usesReference('{foo.bar}')).toBe(true);
  });

  it(`should return true if value uses a reference`, () => {
    expect(usesReference('baz {foo.bar}')).toBe(true);
  });

  it(`returns true if an object uses a reference`, () => {
    expect(usesReference({foo: '{bar}'})).toBe(true);
  });

  it(`returns false if an object doesn't have a reference`, () => {
    expect(usesReference({foo: 'bar'})).toBe(false);
  });

  it(`returns true if a nested object has a reference`, () => {
    expect(usesReference({foo: {bar: '{bar}'}})).toBe(true);
  });

  it(`returns true if an array uses a reference`, () => {
    expect(usesReference(["foo", "{bar}"])).toBe(true);
  });

  it(`returns false if an array doesn't use a reference`, () => {
    expect(usesReference(["foo", "bar"])).toBe(false);
  });

  describe(`with custom options`, () => {
    test(`returns true if value is reference`, () => {
      const customOpts = {
        opening_character: '(',
        closing_character: ')',
        separator: '|'
      };

      expect(usesReference('(foo|bar)', customOpts)).toBe(true);
    });
  });
});
