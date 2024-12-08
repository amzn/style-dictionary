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
import formats from '../../lib/common/formats.js';
import createFormatArgs from '../../lib/utils/createFormatArgs.js';
import { convertTokenData } from '../../lib/utils/convertTokenData.js';

const colorTokenName = 'color-base-red-400';
const colorTokenValue = '#EF5350';

const colorTokens = {
  color: {
    base: {
      red: {
        400: {
          name: colorTokenName,
          value: colorTokenValue,
          original: {
            value: colorTokenValue,
          },
          path: ['color', 'base', 'red', '400'],
        },
      },
    },
  },
};

const file = {
  destination: '__output/',
  format: 'json/flat',
};

const format = formats['json/flat'];

describe('formats', () => {
  describe('json/flat', () => {
    it('should be a valid JSON file and match snapshot', async () => {
      await expect(
        format(
          createFormatArgs({
            dictionary: {
              tokens: colorTokens,
              allTokens: convertTokenData(colorTokens, { output: 'array' }),
            },
            file,
            platform: {},
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });
  });
});
