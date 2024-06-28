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
        flutter: {
          transformGroup: `ios`,
          buildPath,
          files: [
            {
              destination: 'singleton.m',
              format: 'ios/singleton.m',
              options: {
                className: 'StyleDictionary',
              },
            },
            {
              destination: 'singleton.h',
              format: 'ios/singleton.h',
              options: {
                className: 'StyleDictionary',
              },
            },
            {
              destination: 'color.h',
              format: 'ios/colors.h',
              options: {
                className: 'StyleDictionaryColor',
                type: 'StyleDictionaryColorName',
              },
              filter: (token) => token.type === 'color',
            },
            {
              destination: 'color.m',
              format: 'ios/colors.m',
              options: {
                className: 'StyleDictionaryColor',
                type: 'StyleDictionaryColorName',
              },
              filter: (token) => token.type === 'color',
            },
            {
              destination: 'macros.h',
              format: 'ios/macros',
            },
            {
              destination: 'static.h',
              format: 'ios/static.h',
              options: {
                className: 'StyleDictionaryStatic',
                type: 'CGFloat',
              },
              filter: (token) => token.type === 'dimension' || token.type === 'fontSize',
            },
            {
              destination: 'static.m',
              format: 'ios/static.m',
              options: {
                className: 'StyleDictionaryStatic',
                type: 'CGFloat',
              },
              filter: (token) => token.type === 'dimension' || token.type === 'fontSize',
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

  describe('ios objective-c', async () => {
    it(`ios/singleton.m should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}singleton.m`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });

    it(`ios/singleton.h should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}singleton.h`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });

    it(`ios/color.m should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}color.m`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });

    it(`ios/color.h should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}color.h`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });

    it(`ios/macros.h should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}macros.h`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });

    it(`ios/static.h should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}static.h`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });

    it(`ios/static.m should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}static.m`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });
  });
});
