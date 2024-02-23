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

describe('integration', async () => {
  before(async () => {
    const sd = new StyleDictionary({
      source: [`__integration__/tokens/**/[!_]*.json?(c)`],
      platforms: {
        android: {
          transformGroup: `android`,
          buildPath,
          files: [
            {
              destination: `resources.xml`,
              format: `android/resources`,
            },
            {
              destination: `resourcesWithReferences.xml`,
              format: `android/resources`,
              options: {
                outputReferences: true,
              },
            },
            {
              destination: `colors.xml`,
              format: `android/resources`,
              filter: {
                attributes: { category: `color` },
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

  describe('android', async () => {
    describe(`android/resources`, async () => {
      it(`should match snapshot`, async () => {
        const output = fs.readFileSync(resolve(`${buildPath}resources.xml`), {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });

      describe(`with references`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}resourcesWithReferences.xml`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });
      });

      describe(`with filter`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}colors.xml`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });
      });
    });
  });
});
