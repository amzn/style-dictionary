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
import { formats, transformGroups } from '../lib/enums/index.js';

const { cssVariables } = formats;

describe('integration', async () => {
  before(async () => {
    const sd = new StyleDictionary({
      source: [`__integration__/tokens/**/[!_]*.json?(c)`],
      // Testing proper string interpolation with multiple references here.
      // This is a CSS/web-specific thing so only including them in this
      // integration test.
      tokens: {
        breakpoint: {
          xs: { value: '304px' },
          sm: { value: '768px' },
          md: { value: 'calc({breakpoint.xs.value} / {breakpoint.sm.value})' },
        },
      },
      platforms: {
        css: {
          transformGroup: transformGroups.css,
          buildPath,
          files: [
            {
              destination: 'variables.css',
              format: cssVariables,
              options: {
                formatting: { indentation: '    ' },
              },
            },
            {
              destination: 'variablesWithReferences.css',
              format: cssVariables,
              options: {
                outputReferences: true,
                outputReferenceFallbacks: false,
              },
            },
            {
              destination: 'variablesWithReferenceFallbacks.css',
              format: cssVariables,
              options: {
                outputReferences: true,
                outputReferenceFallbacks: true,
              },
            },
            {
              destination: 'variablesWithSelector.css',
              format: cssVariables,
              options: {
                selector: '.test',
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

  describe('css', async () => {
    describe(cssVariables, async () => {
      it(`should match snapshot`, async () => {
        const output = fs.readFileSync(resolve(`${buildPath}variables.css`), {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });

      describe(`with references`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}variablesWithReferences.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });
      });

      describe(`with referenceFallbacks`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(
            resolve(`${buildPath}variablesWithReferenceFallbacks.css`),
            {
              encoding: 'UTF-8',
            },
          );
          await expect(output).to.matchSnapshot();
        });
      });

      describe(`with selector`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}variablesWithSelector.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });
      });

      // TODO: add css validator
    });
  });
});
