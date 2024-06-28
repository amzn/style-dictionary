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
import StyleDictionary from 'style-dictionary';
import { fs } from 'style-dictionary/fs';
import { buildPath } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

describe('integration', () => {
  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('showFileHeader', async () => {
    const sd = new StyleDictionary({
      // we are only testing showFileHeader options so we don't need
      // the full source.
      source: [`__integration__/tokens/size/padding.json`],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath,
          files: [
            {
              destination: 'platform-none-file-none.css',
              format: 'css/variables',
            },
            {
              destination: 'platform-none-file-false.css',
              format: 'css/variables',
              options: {
                showFileHeader: false,
              },
            },
          ],
        },
        fileHeader: {
          transformGroup: 'css',
          buildPath,
          options: {
            showFileHeader: false,
          },
          files: [
            {
              destination: 'platform-false-file-none.css',
              format: 'css/variables',
            },
            {
              destination: 'platform-false-file-true.css',
              format: 'css/variables',
              options: {
                showFileHeader: true,
              },
            },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();

    describe(`without platform options`, () => {
      it(`should show file header if no file options set`, async () => {
        const output = fs.readFileSync(`${buildPath}platform-none-file-none.css`, {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });

      it(`should not show file header if file options set to false`, async () => {
        const output = fs.readFileSync(`${buildPath}platform-none-file-false.css`, {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });
    });

    describe(`with platform options set to false`, () => {
      it(`should not show file header if no file options set`, async () => {
        const output = fs.readFileSync(`${buildPath}platform-false-file-none.css`, {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });

      it(`should show file header if file options set to true`, async () => {
        const output = fs.readFileSync(`${buildPath}platform-false-file-true.css`, {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });
    });
  });
});
