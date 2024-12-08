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
import { isNode } from '../../lib/utils/isNode.js';

const file = {
  destination: '__output/',
  format: 'less/icons',
  name: 'foo',
};

const propertyName = 'content-icon-email';
const propertyValue = "'\\E001'";
const itemClass = '3d_rotation';

const tokens = {
  content: {
    icon: {
      email: {
        name: propertyName,
        value: propertyValue,
        type: 'icon',
        original: {
          value: propertyValue,
        },
        attributes: {
          item: itemClass,
        },
        path: ['content', 'icon', 'email'],
      },
    },
  },
};

const platform = {
  prefix: 'sd', // Style Dictionary Prefix
  // FIXME: check why createFormatArgs requires this prefix to be wrapped inside
  // an options object for it to be properly set as option?
  options: {
    prefix: 'sd',
  },
};

const format = formats['less/icons'];

describe('formats', () => {
  describe('less/icons', () => {
    it('should have a valid less syntax and match snapshot', async () => {
      const result = await format(
        createFormatArgs({
          dictionary: { tokens, allTokens: convertTokenData(tokens, { output: 'array' }) },
          file,
          platform,
        }),
      );

      let _less;
      if (!isNode) {
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
