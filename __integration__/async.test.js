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
import { resolve } from '../lib/resolve.js';
import { buildPath } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

const sleep = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

const textFile = resolve(`${buildPath}text.txt`);

// Tests all hooks async, into a single config
describe('integration', async function () {
  this.timeout(10000);
  before(async () => {
    // so we don't accidentally create side-effects on the StyleDictionary class
    // that will affect outputs of other tests.
    const SDExtension = class extends StyleDictionary {};

    SDExtension.registerParser({
      pattern: /^.+\.json$/g,
      parse: async ({ contents }) => {
        await sleep(10);
        // TODO: verify this is called
        return JSON.parse(contents);
      },
    });

    SDExtension.registerPreprocessor({
      name: 'foo-processor',
      preprocessor: async (tokens) => {
        await sleep(10);
        return {
          ...tokens,
          foo: {
            value: 'foo',
            type: 'other',
          },
        };
      },
    });

    SDExtension.registerTransform({
      name: 'foo-value-transform',
      type: 'value',
      matcher: (token) => token.value === 'foo',
      transformer: async () => {
        await sleep(10);
        return 'bar';
      },
    });

    SDExtension.registerFormat({
      name: 'custom/css',
      formatter: async function ({ dictionary, file, options }) {
        await sleep(10);
        const { outputReferences } = options;
        return (
          (await fileHeader({ file })) +
          ':root {\n' +
          formattedVariables({ format: 'css', dictionary, outputReferences }) +
          '\n}\n'
        );
      },
    });

    SDExtension.registerAction({
      name: 'custom/action',
      do: async function () {
        await fs.promises.writeFile(textFile, 'foo', 'UTF-8');
      },
      undo: async function () {
        await fs.promises.unlink(textFile);
      },
    });

    const sd = new SDExtension({
      source: [`__integration__/tokens/**/[!_]*.json?(c)`],
      platforms: {
        css: {
          transforms: [
            'attribute/cti',
            'name/kebab',
            'time/seconds',
            'html/icon',
            'size/rem',
            'color/css',
            'foo-value-transform',
          ],
          buildPath,
          actions: ['custom/action'],
          files: [
            {
              destination: 'variables.css',
              format: 'custom/css',
              options: {
                fileHeader: async () => {
                  await sleep(10);
                  return ['foo', 'bar'];
                },
              },
              filter: async (token) => {
                await sleep(2);
                return token.attributes.item !== 'info';
              },
            },
          ],
        },
      },
    });

    await sd.buildAllPlatforms();
  });

  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('async hooks', async () => {
    it(`should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}variables.css`), 'utf-8');
      const textFileContents = fs.readFileSync(textFile, 'utf-8');
      expect(textFileContents).to.equal('foo');
      await expect(output).to.matchSnapshot();
    });
  });
});
