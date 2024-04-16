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
        dotnet: {
          transformGroup: `dotnet-maui`,
          buildPath,
          files: [
            {
              destination: 'Color.g.cs',
              format: 'dotnet/class.cs',
              className: 'Colors',
              type: 'Color',
              filter: (token) => token.type === 'color',
            },

            // {
            //   destination: 'singleton.m',
            //   format: 'ios/singleton.m',
            //   className: 'StyleDictionary',
            // },
            // {
            //   destination: 'Color.g.cs',
            //   format: 'ios/colors.h',
            //   className: 'Colors',
            //   type: 'StyleDictionaryColorName',
            //   filter: (token) => token.type === 'color',
            // },
            // {
            //   destination: 'static.h',
            //   format: 'ios/static.h',
            //   className: 'StyleDictionaryStatic',
            //   type: 'CGFloat',
            //   filter: (token) => token.type === 'dimension' || token.type === 'fontSize',
            // },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();
  });

  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('dotnet color', async () => {
    it(`dotnet/class.cs should match snapshot`, async () => {
      const output = fs.readFileSync(resolve(`${buildPath}Color.g.cs`), {
        encoding: `UTF-8`,
      });
      await expect(output).to.matchSnapshot();
    });
  });
});
