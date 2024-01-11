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
import Color from 'tinycolor2';
import { resolve } from '../lib/resolve.js';
import { buildPath } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

describe('integration', () => {
  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('W3C DTCG draft spec forward compatibility', async () => {
    const sd = new StyleDictionary({
      tokens: {
        colors: {
          $type: 'color', // $type should be inherited by the children
          black: {
            $value: '#000000', // $value should work
          },
        },
      },
      transform: {
        'custom/css/color': {
          type: 'value',
          matcher: (token) => token.$type === 'color',
          transformer: (token) => {
            return Color(token.$value).toRgbString();
          },
        },
      },
      platforms: {
        css: {
          transforms: ['name/cti/kebab', 'custom/css/color'],
          buildPath,
          files: [
            {
              destination: 'vars.css',
              format: 'css/variables',
            },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();

    const output = fs.readFileSync(resolve(`${buildPath}vars.css`), {
      encoding: `UTF-8`,
    });

    it(`should match snapshot`, async () => {
      await expect(output).to.matchSnapshot();
    });
  });
});
