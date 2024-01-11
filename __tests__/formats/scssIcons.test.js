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
  format: 'scss/icons',
  name: 'foo',
};

const propertyName = 'content-icon-email';
const propertyValue = "'\\E001'";
const itemClass = 'three-d_rotation';

const tokens = {
  content: {
    icon: {
      email: {
        name: propertyName,
        value: propertyValue,
        original: {
          value: propertyValue,
        },
        attributes: {
          category: 'content',
          type: 'icon',
          item: itemClass,
        },
        path: ['content', 'icon', 'email'],
      },
    },
  },
};

const platform = {
  prefix: 'sd', // Style-Dictionary Prefix
  // FIXME: check why createFormatArgs requires this prefix to be wrapped inside
  // an options object for it to be properly set as option?
  options: {
    prefix: 'sd',
  },
};

const format = formats['scss/icons'];

describe('formats', () => {
  describe('scss/icons', () => {
    it('should have a valid scss syntax and match snapshot', async () => {
      const result = format(
        createFormatArgs({
          dictionary: { tokens, allTokens: flattenTokens(tokens) },
          file,
          platform,
        }),
        platform,
        file,
      );
      const scssResult = compileString(result);
      await expect(result).to.matchSnapshot(1);
      await expect(scssResult.css).to.matchSnapshot(2);
    });
  });
});
