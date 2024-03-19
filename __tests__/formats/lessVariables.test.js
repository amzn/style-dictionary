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
import flattenTokens from '../../lib/utils/flattenTokens.js';

const file = {
  destination: '__output/',
  format: 'less/variables',
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

const format = formats['less/variables'];

describe('formats', () => {
  describe('less/variables', () => {
    it('should have a valid less syntax and match snapshot', async () => {
      const result = await format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform: {},
        }),
        {},
        file,
      );
      let _less;
      if (typeof window === 'object') {
        await import('less/dist/less.js');
        // eslint-disable-next-line no-undef
        _less = less;
      } else {
        _less = (await import('less')).default;
      }
      const lessResult = await _less.render(result);
      await expect(result).to.matchSnapshot(1);
      await expect(lessResult.css).to.matchSnapshot(2);
    });
  });
});
