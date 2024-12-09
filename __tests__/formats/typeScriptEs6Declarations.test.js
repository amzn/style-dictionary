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

const { typescriptEs6Declarations } = fileFormats;

const file = {
  destination: '__output/',
  format: typescriptEs6Declarations,
};

const tokens = {
  color: {
    red: {
      comment: 'Used for errors',
      name: 'colorRed',
      value: '#FF0000',
    },
  },
  font: {
    family: {
      name: 'fontFamily',
      value: '"Source Sans Pro", Arial, sans-serif',
    },
  },
};

const DTCGTokens = {
  color: {
    red: {
      $description: 'Used for errors',
      $type: 'color',
      $value: '#FF0000',
      name: 'colorRed',
    },
  },
  font: {
    family: {
      $type: 'fontFamily',
      $value: '"Source Sans Pro", Arial, sans-serif',
      name: 'fontFamily',
    },
  },
};

const format = formats[typescriptEs6Declarations];

describe('formats', () => {
  describe(typescriptEs6Declarations, () => {
    const formatArgs = (usesDtcg, customFile) =>
      createFormatArgs({
        dictionary: {
          tokens: usesDtcg ? DTCGTokens : tokens,
          allTokens: convertTokenData(usesDtcg ? DTCGTokens : tokens, {
            output: 'array',
            usesDtcg,
          }),
        },
        file: customFile ?? file,
        platform: {},
        options: { usesDtcg },
      });

    it('should be a valid TS file', async () => {
      const output = await format(formatArgs(false));

      // get all lines that begin with export
      const lines = output.split('\n').filter((l) => l.indexOf('export') >= 0);

      // assert that any lines have a string type definition
      lines.forEach((l) => {
        expect(l.match(/^export.*: string;$/g).length).to.equal(1);
      });
    });

    it('without outputStringLiterals should match snapshot', async () => {
      const customFile = {
        ...file,
        options: {
          outputStringLiterals: false,
        },
      };
      const output = await format(formatArgs(false, customFile));

      await expect(output).to.matchSnapshot();
    });

    it('with outputStringLiterals should match snapshot', async () => {
      const customFile = {
        ...file,
        options: {
          outputStringLiterals: true,
        },
      };
      const output = await format(formatArgs(false, customFile));

      await expect(output).to.matchSnapshot();
    });

    it('with DTCG tokens and outputStringLiterals should match snapshot', async () => {
      const customFile = {
        ...file,
        options: {
          outputStringLiterals: true,
        },
      };
      const output = await format(formatArgs(true, customFile));

      await expect(output).to.matchSnapshot();
    });

    it('with DTCG tokens and without outputStringLiterals should match snapshot', async () => {
      const customFile = {
        ...file,
        options: {
          outputStringLiterals: false,
        },
      };
      const output = await format(formatArgs(true, customFile));

      await expect(output).to.matchSnapshot();
    });
  });
});
