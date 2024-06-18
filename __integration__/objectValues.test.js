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
import Color from 'tinycolor2';
import StyleDictionary from 'style-dictionary';
import { fs } from 'style-dictionary/fs';
import { resolve } from '../dist/esm/resolve.mjs';
import { buildPath } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

describe('integration', async () => {
  before(async () => {
    const options = {
      outputReferences: true,
    };
    const sd = new StyleDictionary({
      tokens: {
        hue: `120`,
        saturation: `50%`,
        lightness: `50%`,
        color: {
          red: { value: '#f00', type: 'color' },
          green: {
            value: {
              h: '{hue}',
              s: '{saturation}',
              l: '{lightness}',
            },
            type: 'color',
          },
        },
        size: {
          border: { value: 0.125, type: 'dimension' },
        },
        border: {
          primary: {
            // getReferences should work on objects like this:
            value: {
              color: '{color.red.value}',
              width: '{size.border.value}',
              style: 'solid',
            },
            type: 'border',
          },
        },
        shadow: {
          light: {
            value: [
              {
                color: '{color.red.value}',
              },
              {
                color: '{color.green.value}',
              },
            ],
            type: 'shadow',
          },
          dark: {
            value: [
              {
                color: '{color.green.value}',
              },
              {
                color: '{color.red.value}',
              },
            ],
            type: 'shadow',
          },
        },
      },
      hooks: {
        transforms: {
          hsl: {
            type: 'value',
            transitive: true,
            filter: (token) => token.original.value.h,
            transform: (token) => {
              return `hsl(${token.value.h}, ${token.value.s}, ${token.value.l})`;
            },
          },
          hslToHex: {
            type: 'value',
            transitive: true,
            filter: (token) => token.original.value.h,
            transform: (token) => {
              return Color(
                `hsl(${token.value.h}, ${token.value.s}, ${token.value.l})`,
              ).toHexString();
            },
          },
        },
      },
      platforms: {
        // This will test to see if a value object for an hsl color works
        // with and without `outputReferences`
        cssHsl: {
          buildPath,
          transforms: StyleDictionary.hooks.transformGroups.css.concat([`hsl`]),
          files: [
            {
              destination: `hsl.css`,
              format: `css/variables`,
              filter: (token) => token.type === `color`,
            },
            {
              destination: `hslWithReferences.css`,
              format: `css/variables`,
              filter: (token) => token.type === `color`,
              options,
            },
          ],
        },

        // This will test to see if a value object for an hsl that has been
        // transformed to a hex color works with and without `outputReferences`
        cssHex: {
          buildPath,
          transforms: StyleDictionary.hooks.transformGroups.css.concat([`hslToHex`]),
          files: [
            {
              destination: 'hex.css',
              format: 'css/variables',
              filter: (token) => token.type === `color`,
            },
            {
              destination: 'hexWithReferences.css',
              format: 'css/variables',
              filter: (token) => token.type === `color`,
              options,
            },
          ],
        },

        // This will test to see if a value object for a border
        // works with and without `outputReferences`
        cssBorder: {
          buildPath,
          transforms: StyleDictionary.hooks.transformGroups.css,
          files: [
            {
              destination: 'border.css',
              format: 'css/variables',
              filter: (token) => token.type === `border`,
            },
            {
              destination: 'borderWithReferences.css',
              format: 'css/variables',
              filter: (token) => token.type === `border`,
              options,
            },
          ],
        },
        cssShadow: {
          buildPath,
          transforms: StyleDictionary.hooks.transformGroups.css.concat([`hslToHex`]),
          files: [
            {
              destination: 'shadow.css',
              format: 'css/variables',
              filter: (token) => token.type === `shadow`,
            },
            {
              destination: 'shadowWithReferences.css',
              format: 'css/variables',
              filter: (token) => token.type === `shadow`,
              options,
            },
          ],
        },

        scss: {
          buildPath,
          transforms: StyleDictionary.hooks.transformGroups.css.concat([`hslToHex`]),
          files: [
            {
              destination: 'border.scss',
              format: 'scss/variables',
              filter: (token) => token.type === `border`,
            },
            {
              destination: 'borderWithReferences.scss',
              format: 'scss/variables',
              filter: (token) => token.type === `border`,
              options,
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

  describe('object values', async () => {
    describe('css/variables', async () => {
      describe(`hsl syntax`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}hsl.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });

        describe(`with references`, async () => {
          it(`should match snapshot`, async () => {
            const output = fs.readFileSync(resolve(`${buildPath}hslWithReferences.css`), {
              encoding: 'UTF-8',
            });
            await expect(output).to.matchSnapshot();
          });
        });
      });

      describe(`hex syntax`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}hex.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });

        describe(`with references`, async () => {
          it(`should match snapshot`, async () => {
            const output = fs.readFileSync(resolve(`${buildPath}hexWithReferences.css`), {
              encoding: 'UTF-8',
            });
            await expect(output).to.matchSnapshot();
          });
        });
      });

      describe(`border`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}border.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });

        describe(`with references`, async () => {
          it(`should match snapshot`, async () => {
            const output = fs.readFileSync(resolve(`${buildPath}borderWithReferences.css`), {
              encoding: 'UTF-8',
            });
            await expect(output).to.matchSnapshot();
          });
        });
      });

      describe('shadow', async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}shadow.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });

        it(`should match snapshot with references`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}shadowWithReferences.css`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });
      });
    });

    describe('scss/variables', async () => {
      it(`should match snapshot`, async () => {
        const output = fs.readFileSync(resolve(`${buildPath}border.scss`), {
          encoding: 'UTF-8',
        });
        await expect(output).to.matchSnapshot();
      });
      describe(`with references`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}borderWithReferences.scss`), {
            encoding: 'UTF-8',
          });
          await expect(output).to.matchSnapshot();
        });
      });
    });
  });
});
