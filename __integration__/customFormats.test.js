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

  describe('custom formats', async () => {
    const sd = new StyleDictionary({
      source: [`__integration__/tokens/size/padding.json`],
      // Adding formats directly to SD
      format: {
        inlineCustomFormatWithOldArgs: (dictionary, platform, file) => {
          return JSON.stringify({ dictionary, platform, file }, null, 2);
        },
        inlineCustomFormatWithNewArgs: (opts) => {
          return JSON.stringify(opts, null, 2);
        },
      },
      platforms: {
        inlineCustomFormats: {
          transformGroup: 'js',
          buildPath,
          options: {
            otherOption: `platform option`,
          },
          files: [
            {
              destination: 'inlineCustomFormatWithOldArgs.json',
              format: 'inlineCustomFormatWithOldArgs',
              options: {
                showFileHeader: true,
                otherOption: 'Test',
              },
            },
            {
              destination: 'inlineCustomFormatWithNewArgs.json',
              format: 'inlineCustomFormatWithNewArgs',
              options: {
                showFileHeader: true,
                otherOption: 'Test',
              },
            },
          ],
        },
        customFormats: {
          transformGroup: 'js',
          buildPath,
          options: {
            otherOption: `platform option`,
          },
          files: [
            {
              destination: 'registerCustomFormatWithOldArgs.json',
              format: 'registerCustomFormatWithOldArgs',
              options: {
                showFileHeader: true,
                otherOption: 'Test',
              },
            },
            {
              destination: 'registerCustomFormatWithNewArgs.json',
              format: 'registerCustomFormatWithNewArgs',
              options: {
                showFileHeader: true,
                otherOption: 'Test',
              },
            },
          ],
        },
      },
    });

    sd.registerFormat({
      name: 'registerCustomFormatWithOldArgs',
      formatter: (dictionary, platform, file) => {
        return JSON.stringify({ dictionary, platform, file }, null, 2);
      },
    });

    sd.registerFormat({
      name: 'registerCustomFormatWithNewArgs',
      formatter: (opts) => {
        return JSON.stringify(opts, null, 2);
      },
    });

    await sd.buildAllPlatforms();

    describe(`inline custom with old args`, () => {
      const output = fs.readFileSync(`${buildPath}inlineCustomFormatWithOldArgs.json`, {
        encoding: 'UTF-8',
      });

      it(`should match snapshot`, async () => {
        await expect(output).to.matchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file } = JSON.parse(output);
        expect(dictionary).to.have.property(`tokens`);
        expect(dictionary).to.have.property(`allTokens`);
        expect(platform).to.have.nested.property(`options.otherOption`, `platform option`);
        expect(file).to.have.nested.property(`options.otherOption`, `Test`);
      });
    });

    describe(`inline custom with new args`, async () => {
      const output = fs.readFileSync(`${buildPath}inlineCustomFormatWithNewArgs.json`, {
        encoding: 'UTF-8',
      });
      it(`should match snapshot`, async () => {
        await expect(output).to.matchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file, options } = JSON.parse(output);
        expect(dictionary).to.have.property(`tokens`);
        expect(dictionary).to.have.property(`allTokens`);
        expect(platform).to.have.nested.property(`options.otherOption`, `platform option`);
        expect(file).to.have.nested.property(`options.otherOption`, `Test`);
        expect(options).to.have.property(`otherOption`, `Test`);
      });
    });

    describe(`register custom format with old args`, () => {
      const output = fs.readFileSync(`${buildPath}registerCustomFormatWithOldArgs.json`, {
        encoding: 'UTF-8',
      });

      it(`should match snapshot`, async () => {
        await expect(output).to.matchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file } = JSON.parse(output);
        expect(dictionary).to.have.property(`tokens`);
        expect(dictionary).to.have.property(`allTokens`);
        expect(platform).to.have.nested.property(`options.otherOption`, `platform option`);
        expect(file).to.have.nested.property(`options.otherOption`, `Test`);
      });
    });

    describe(`register custom format with new args`, () => {
      const output = fs.readFileSync(`${buildPath}registerCustomFormatWithNewArgs.json`, {
        encoding: 'UTF-8',
      });

      it(`should match snapshot`, async () => {
        await expect(output).to.matchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file, options } = JSON.parse(output);
        expect(dictionary).to.have.property(`tokens`);
        expect(dictionary).to.have.property(`allTokens`);
        expect(platform).to.have.nested.property(`options.otherOption`, `platform option`);
        expect(file).to.have.nested.property(`options.otherOption`, `Test`);
        expect(options).to.have.property(`otherOption`, `Test`);
      });
    });
  });
});
