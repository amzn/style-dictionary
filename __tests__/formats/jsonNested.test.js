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
  destination: 'output/',
  format: 'json/nested',
};

const tokens = {
  color: {
    base: {
      comment: 'This is a comment',
      metadata: [1, 2, 3],
      red: {
        primary: { value: '#611D1C' },
        secondary: {
          inverse: { value: '#000000' },
        },
      },
    },
  },
};

const format = formats['json/nested'];

describe('formats', function () {
  describe('json/nested', function () {
    it('should be a valid JSON file and match snapshot', async () => {
      await expect(
        format(
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
