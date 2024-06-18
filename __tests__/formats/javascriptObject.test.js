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
import formats from '../../dist/esm/common/formats.mjs';
import { createFormatArgs, flattenTokens } from 'style-dictionary/utils';

const file = {
  destination: '__output/',
  format: 'javascript/object',
  options: { name: 'foo' },
};

const tokens = {
  color: {
    red: { value: '#FF0000' },
  },
};

const format = formats['javascript/object'];

describe('formats', () => {
  describe('javascript/object', () => {
    it('should be valid JS syntax and match snapshot', async () => {
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
