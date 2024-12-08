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

const file = {
  destination: '__output/',
  format: 'typescript/module-declarations',
  filter: { type: 'color' },
};

const tokens = {
  color: {
    red: { value: '#FF0000' },
  },
};

const format = formats['typescript/module-declarations'].bind(file);

describe('formats', () => {
  describe('typescript/module-declarations', () => {
    it('should be a valid TS file', async () => {
      const output = await format(
        createFormatArgs({
          dictionary: { tokens, allTokens: convertTokenData(tokens, { output: 'array' }) },
          file,
          platform: {},
        }),
        {},
        file,
      );

      // get all lines that have DesignToken
      const lines = output.split('\n').filter((l) => l.indexOf(': DesignToken') >= 0);

      // assert that any lines have a DesignToken type definition
      lines.forEach((l) => {
        expect(l.match(/^.*: DesignToken;$/g).length).to.equal(1);
      });
    });
  });
});
