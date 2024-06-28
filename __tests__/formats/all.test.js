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
import { deepmerge } from '../../lib/utils/deepmerge.js';

const file = {
  destination: '__output/',
  format: 'javascript/es6',
  filter: {
    type: 'color',
  },
};

const tokens = {
  color: {
    red: {
      value: '#FF0000',
      type: 'color',
      original: { value: '#FF0000' },
      name: 'color_red',
      comment: 'comment',
      path: ['color', 'red'],
    },
  },
};

describe('formats', async () => {
  for (const key of Object.keys(formats)) {
    const format = formats[key].bind(file);

    describe('all', () => {
      it('should match ' + key + ' snapshot', async () => {
        const output = await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file,
            platform: {},
          }),
          {},
          file,
        );
        await expect(output).to.matchSnapshot();
      });

      it('should match ' + key + ' snapshot with fileHeaderTimestamp set', async () => {
        const _file = deepmerge(file, {
          options: {
            formatting: {
              fileHeaderTimestamp: true,
            },
          },
        });
        const output = await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file: _file,
            platform: {},
          }),
          {},
          _file,
        );
        await expect(output).to.matchSnapshot();
      });

      it('should return ' + key + ' as a string', async () => {
        const output = await format(
          createFormatArgs({
            dictionary: { tokens, allTokens: flattenTokens(tokens) },
            file,
            platform: {},
          }),
          {},
          file,
        );
        expect(typeof output).to.equal('string');
      });
    });
  }
});
