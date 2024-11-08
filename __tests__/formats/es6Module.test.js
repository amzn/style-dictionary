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
  format: 'javascript/esm',
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
        name: 'colors-red-500',
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
      name: 'dimension-xs',
    },
  },
};

const DTCGTokens = {
  colors: {
    red: {
      500: {
        $value: '#ff0000',
        $type: 'color',
        path: ['colors', 'red', '500'],
        filePath: 'tokens.json',
        attributes: {
          foo: 'bar',
        },
        name: 'colors-red-500',
      },
    },
  },
  dimensions: {
    xs: {
      $value: '15px',
      $type: 'dimension',
      path: ['dimension', 'xs'],
      filePath: 'tokens.json',
      attributes: {
        foo: 'bar',
      },
      name: 'dimension-xs',
    },
  },
};

const format = formats['javascript/esm'];

describe('formats', () => {
  describe('javascript/esm', () => {
    it('should be a valid JS file and match snapshot', async () => {
      await expect(
        await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file,
            platform: {},
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });

    it('should optionally allow stripping StyleDictionary metadata', async () => {
      await expect(
        await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file,
            platform: {},
            options: {
              stripMeta: true,
            },
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });

    it('should optionally allow stripping everything but an allowlist of props', async () => {
      await expect(
        await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file,
            platform: {},
            options: {
              stripMeta: {
                keep: ['value', 'type'],
              },
            },
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });

    it('should optionally allow stripping custom list of metadata props', async () => {
      await expect(
        await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file,
            platform: {},
            options: {
              stripMeta: {
                strip: ['attributes', 'filePath'],
              },
            },
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });

    it('should optionally allow stripping StyleDictionary metadata for DTCG formatted tokens', async () => {
      await expect(
        await format(
          createFormatArgs({
            dictionary: { tokens: DTCGTokens, allTokens: flattenTokens(DTCGTokens) },
            file,
            platform: {},
            options: {
              usesDtcg: true,
              stripMeta: true,
            },
          }),
          {},
          file,
        ),
      ).to.matchSnapshot();
    });
  });
});
