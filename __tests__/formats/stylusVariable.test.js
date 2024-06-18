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
// import stylus from 'stylus'; see comment in test below
import formats from '../../dist/esm/common/formats.mjs';
import { createFormatArgs, flattenTokens } from 'style-dictionary/utils';

const file = {
  destination: '__output/',
  format: 'stylus/variables',
  name: 'foo',
};

const propertyName = 'color-base-red-400';
const propertyValue = '#EF5350';

const tokens = {
  color: {
    base: {
      red: {
        400: {
          name: propertyName,
          value: propertyValue,
          original: {
            value: propertyValue,
          },
          path: ['color', 'base', 'red', '400'],
        },
      },
    },
  },
};

const format = formats['stylus/variables'];

describe('formats', () => {
  describe('stylus/variables', () => {
    it('should have a valid stylus syntax and match snapshot', async () => {
      const result = format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      expect(result).to.matchSnapshot(1);

      // Unfortunately, stylus has not followed less and scss in exposing
      // a browser compatible version of the package to run client-side.
      // const stylusResult = stylus.render(result);
      // expect(stylusResult).to.matchSnapshot(2);
    });
  });
});
