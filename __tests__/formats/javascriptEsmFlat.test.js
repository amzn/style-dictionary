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
import { formats as formatsEnum } from '../../lib/enums/formats.js';

const { javascriptEsm } = formatsEnum;

const file = {
  destination: '__output/',
  format: javascriptEsm,
  options: {
    flat: true,
  },
  filter: {
    type: 'color',
  },
};

const tokens = {
  colors: {
    red: {
      500: {
        value: '#ff0000',
        type: 'color',
        path: ['colors', 'red', '500'],
        filePath: 'tokens.json',
        attributes: {
          foo: 'bar',
        },
        name: 'ColorsRed500',
      },
    },
  },
  dimensions: {
    xs: {
      value: '15px',
      type: 'dimension',
      path: ['dimension', 'xs'],
      filePath: 'tokens.json',
      attributes: {
        foo: 'bar',
      },
      name: 'DimensionXs',
    },
  },
};

const format = formats[javascriptEsm];

describe('formats', () => {
  describe(javascriptEsm, () => {
    it('should be a valid JS file and match snapshot', async () => {
      await expect(
        await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: convertTokenData(tokens, { output: 'array' }) },
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
