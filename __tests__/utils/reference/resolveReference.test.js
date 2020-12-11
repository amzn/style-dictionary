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

const resolveReference = require('../../../lib/utils/references/resolveReference');

const dictionary = {
  color: {
    palette: {
      neutral: {
        0: { value: "#ffffff" },
        5: { value: "#f2f3f4" }
      }
    },
    background: {
      primary: { value: "{color.palette.neutral.0.value}" }
    }
  },
  arr: [
    'one',
    'two'
  ]
}

describe('resolveReference()', () => {
  it(`returns undefined for non-strings`, () => {
    expect(resolveReference(42, dictionary)).toBe(undefined);
  });

  it(`returns undefined if it does not find the path in the object`, () => {
    expect(resolveReference(['color','foo'], dictionary)).toBe(undefined);
    expect(resolveReference(['color','foo','bar'], dictionary)).toBe(undefined);
  });

  it(`returns the part of the object if referenced path exists`, () => {
    expect(
      resolveReference(['color','palette','neutral','0','value'], dictionary)
    ).toEqual(dictionary.color.palette.neutral['0'].value);
    expect(
      resolveReference(['color'], dictionary)
    ).toEqual(dictionary.color);
  });

  it(`works with arrays`, () => {
    expect(
      resolveReference(['arr'], dictionary)
    ).toEqual(dictionary.arr);
  });

  it(`works with array indices`, () => {
    expect(
      resolveReference(['arr','0'], dictionary)
    ).toEqual(dictionary.arr[0]);
  });
});
