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
import getValueByPath from '../../../lib/utils/references/getValueByPath.js';

const dictionary = {
  color: {
    palette: {
      neutral: {
        0: { value: '#ffffff' },
        5: { value: '#f2f3f4' },
      },
    },
    background: {
      primary: { value: '{color.palette.neutral.0.value}' },
    },
  },
  arr: ['one', 'two'],
};

describe('getValueByPath()', () => {
  it(`returns undefined for non-strings`, () => {
    expect(getValueByPath(42, dictionary)).to.be.undefined;
  });

  it(`returns undefined if it does not find the path in the object`, () => {
    expect(getValueByPath(['color', 'foo'], dictionary)).to.be.undefined;
    expect(getValueByPath(['color', 'foo', 'bar'], dictionary)).to.be.undefined;
  });

  it(`returns the part of the object if referenced path exists`, () => {
    expect(getValueByPath(['color', 'palette', 'neutral', '0', 'value'], dictionary)).to.equal(
      dictionary.color.palette.neutral['0'].value,
    );
    expect(getValueByPath(['color'], dictionary)).to.equal(dictionary.color);
  });

  it(`works with arrays`, () => {
    expect(getValueByPath(['arr'], dictionary)).to.equal(dictionary.arr);
  });

  it(`works with array indices`, () => {
    expect(getValueByPath(['arr', '0'], dictionary)).to.equal(dictionary.arr[0]);
  });
});
