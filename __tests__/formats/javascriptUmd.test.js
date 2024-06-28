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
  format: 'javascript/umd',
  filter: {
    type: 'color',
  },
};

const tokens = {
  color: {
    red: { value: '#FF0000' },
  },
};

const format = formats['javascript/umd'];

describe('formats', () => {
  describe('javascript/umd', () => {
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
  });
});
