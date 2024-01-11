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
import { compileString } from 'sass';
import formats from '../../lib/common/formats.js';
import createFormatArgs from '../../lib/utils/createFormatArgs.js';
import flattenTokens from '../../lib/utils/flattenTokens.js';

const file = {
  destination: '__output/',
  format: 'scss/variables',
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
          attributes: {
            category: 'color',
            type: 'base',
            item: 'red',
            subitem: '400',
          },
          path: ['color', 'base', 'red', '400'],
        },
      },
    },
  },
};

const format = formats['scss/variables'];

describe('formats', () => {
  describe('scss/variables', () => {
    it('should have a valid scss syntax and match snapshot', async () => {
      const result = format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      const scssResult = compileString(result);
      await expect(result).to.matchSnapshot(1);
      await expect(scssResult.css).to.matchSnapshot(2);
    });

    it('should optionally use !default', async () => {
      const themeableDictionary = { tokens, allTokens: flattenTokens(tokens) };
      const formattedScss = format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );

      expect(formattedScss).not.to.match(new RegExp('!default;'));

      themeableDictionary.allTokens[0].themeable = true;
      const themeableScss = format(
        createFormatArgs({
          dictionary: themeableDictionary,
          file,
          platform: {},
        }),
        {},
        file,
      );

      expect(themeableScss).to.match(new RegExp('#EF5350 !default;'));
    });
  });
});
