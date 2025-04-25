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
import { formats as fileFormats } from '../../lib/enums/index.js';

const { javascriptEs6 } = fileFormats;

const file = {
  destination: 'output.js',
  format: javascriptEs6,
  filter: {
    type: 'color',
  },
};

const tokens = {
  color: {
    red: {
      comment: 'comment',
      name: 'red',
      original: {
        value: '#EF5350',
      },
      path: ['color', 'red'],
      type: 'color',
      value: '#EF5350',
    },
  },
};

const DTCGTokens = {
  color: {
    red: {
      $description: 'comment',
      name: 'red',
      original: {
        $value: '#EF5350',
      },
      path: ['color', 'red'],
      $type: 'color',
      $value: '#EF5350',
    },
  },
};

const commentTokens = {
  color: {
    red: {
      comment: 'comment',
      name: 'red',
      original: {
        value: '#EF5350',
      },
      path: ['color', 'red'],
      type: 'color',
      value: '#EF5350',
    },
    blue: {
      comment: 'multiline\ncomment',
      name: 'blue',
      original: {
        value: '#4FEDF0',
      },
      path: ['color', 'blue'],
      type: 'color',
      value: '#4FEDF0',
    },
  },
};

const format = formats[javascriptEs6];

describe('formats', () => {
  describe(javascriptEs6, () => {
    const formatArgs = (usesDtcg) =>
      createFormatArgs({
        dictionary: {
          tokens: usesDtcg ? DTCGTokens : tokens,
          allTokens: convertTokenData(usesDtcg ? DTCGTokens : tokens, {
            output: 'array',
            usesDtcg,
          }),
        },
        file,
        platform: {},
        options: { usesDtcg },
      });

    it('should be a valid JS file and match snapshot', async () => {
      const output = await format(formatArgs(false));

      await expect(output).to.matchSnapshot();
    });

    it('should handle DTCG token format, be a valid JS file and matches snapshot', async () => {
      const output = await format(formatArgs(true));

      await expect(output).to.matchSnapshot();
    });

    it('should handle multiline comments', async () => {
      const output = await format(
        createFormatArgs({
          dictionary: {
            tokens: commentTokens,
            allTokens: convertTokenData(commentTokens, { output: 'array' }),
          },
          file,
          platform: {},
        }),
      );
      await expect(output).to.matchSnapshot();
    });
  });
});
