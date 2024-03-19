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

const originalFile = {
  destination: '__output/',
  format: 'ios-swift/any.swift',
  className: 'StyleDictionary',
  filter: {
    type: 'color',
  },
  options: {},
};

let file = {};

const tokens = {
  color: {
    base: {
      red: {
        value: 'UIColor(red: 1.000, green: 0.000, blue: 0.000, alpha: 1)',
        filePath: 'tokens/color/base.json',
        original: { value: '#FF0000' },
        name: 'colorBaseRed',
        path: ['color', 'base', 'red'],
      },
    },
  },
};

const format = formats['ios-swift/any.swift'];

describe('formats', () => {
  describe('ios-swift/any.swift', () => {
    beforeEach(() => {
      file = structuredClone(originalFile);
    });

    it('should match default snapshot', async () => {
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

    it('with import override should match snapshot', async () => {
      file.options.import = ['UIKit', 'AnotherModule'];
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

    it('with objectType override should match snapshot', async () => {
      file.options.objectType = 'struct';
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

    it('with access control override should match snapshot', async () => {
      file.options.accessControl = 'internal';
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
  });
});
