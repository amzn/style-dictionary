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

const fs = require('fs-extra');
const Color = require('tinycolor2');
const StyleDictionary = require('../index');
const {buildPath} = require('./_constants');

const options = {
  outputReferences: true
}

describe('integration', () => {
  describe('object values', () => {
    StyleDictionary.extend({
      properties: {
        hue: `120`,
        saturation: `50%`,
        lightness: `50%`,
        color: {
          red: { value: "#f00" },
          green: {
            value: {
              h: "{hue}",
              s: "{saturation}",
              l: "{lightness}"
            }
          }
        },
        size: {
          border: { value: 0.125 }
        },
        border: {
          primary: {
            // getReferences should work on objects like this:
            value: {
              color: "{color.red.value}",
              width: "{size.border.value}",
              style: "solid"
            }
          },
        },
        shadow: {
          light: {
            value: [{
              color: "{color.red.value}"
            },{
              color: "{color.green.value}"
            }]
          },
          dark: {
            value: [{
              color: "{color.green.value}"
            },{
              color: "{color.red.value}"
            }]
          }
        }
      },
      transform: {
        hsl: {
          type: 'value',
          transitive: true,
          matcher: (token) => token.original.value.h,
          transformer: (token) => {
            return `hsl(${token.value.h}, ${token.value.s}, ${token.value.l})`
          }
        },
        hslToHex: {
          type: 'value',
          transitive: true,
          matcher: (token) => token.original.value.h,
          transformer: (token) => {
            return Color(`hsl(${token.value.h}, ${token.value.s}, ${token.value.l})`).toHexString();
          }
        },
        cssBorder: {
          type: 'value',
          transitive: true,
          matcher: (token) => token.path[0] === `border`,
          transformer: (token) => {
            return `${token.value.width} ${token.value.style} ${token.value.color}`
          }
        },
        shadow: {
          type: 'value',
          transitive: true,
          matcher: (token) => token.attributes.category === 'shadow',
          transformer: (token) => {
            return token.value.map(obj => obj.color).join(', ')
          }
        }
      },
      platforms: {
        // This will test to see if a value object for an hsl color works
        // with and without `outputReferences`
        cssHsl: {
          buildPath,
          transforms: StyleDictionary.transformGroup.css.concat([`hsl`]),
          files: [{
            destination: `hsl.css`,
            format: `css/variables`,
            filter: (token) => token.attributes.category === `color`
          },{
            destination: `hslWithReferences.css`,
            format: `css/variables`,
            filter: (token) => token.attributes.category === `color`,
            options
          }]
        },

        // This will test to see if a value object for an hsl that has been
        // transformed to a hex color works with and without `outputReferences`
        cssHex: {
          buildPath,
          transforms: StyleDictionary.transformGroup.css.concat([`cssBorder`,`hslToHex`]),
          files: [{
            destination: 'hex.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === `color`,
          },{
            destination: 'hexWithReferences.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === `color`,
            options
          }]
        },

        // This will test to see if a value object for a border
        // works with and without `outputReferences`
        cssBorder: {
          buildPath,
          transforms: StyleDictionary.transformGroup.css.concat([`cssBorder`]),
          files: [{
            destination: 'border.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === `border`,
          },{
            destination: 'borderWithReferences.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === `border`,
            options
          }]
        },

        cssShadow: {
          buildPath,
          transforms: StyleDictionary.transformGroup.css.concat([`shadow`,`hslToHex`]),
          files: [{
            destination: 'shadow.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === `shadow`,
          },{
            destination: 'shadowWithReferences.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === `shadow`,
            options
          }]
        },

        scss: {
          buildPath,
          transforms: StyleDictionary.transformGroup.css.concat([`cssBorder`,`hslToHex`]),
          files: [{
            destination: 'border.scss',
            format: 'scss/variables',
            filter: (token) => token.attributes.category === `border`,
          },{
            destination: 'borderWithReferences.scss',
            format: 'scss/variables',
            filter: (token) => token.attributes.category === `border`,
            options
          }]
        },
      }
    }).buildAllPlatforms();

    describe('css/variables', () => {
      describe(`hsl syntax`, () => {
        const output = fs.readFileSync(`${buildPath}hsl.css`, {encoding:'UTF-8'});
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });

        describe(`with references`, () => {
          const output = fs.readFileSync(`${buildPath}hslWithReferences.css`, {encoding:'UTF-8'});
          it(`should match snapshot`, () => {
            expect(output).toMatchSnapshot();
          });
        });
      });

      describe(`hex syntax`, () => {
        const output = fs.readFileSync(`${buildPath}hex.css`, {encoding:'UTF-8'});
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });

        describe(`with references`, () => {
          const output = fs.readFileSync(`${buildPath}hexWithReferences.css`, {encoding:'UTF-8'});
          it(`should match snapshot`, () => {
            expect(output).toMatchSnapshot();
          });
        });
      });

      describe(`border`, () => {
        const output = fs.readFileSync(`${buildPath}border.css`, {encoding:'UTF-8'});
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });

        describe(`with references`, () => {
          const output = fs.readFileSync(`${buildPath}borderWithReferences.css`, {encoding:'UTF-8'});
          it(`should match snapshot`, () => {
            expect(output).toMatchSnapshot();
          });
        });
      });

      describe('shadow', () => {
        it(`should match snapshot`, () => {
          const output = fs.readFileSync(`${buildPath}shadow.css`, {encoding:'UTF-8'});
          expect(output).toMatchSnapshot();
        });

        it(`should match snapshot with references`, () => {
          const output = fs.readFileSync(`${buildPath}shadowWithReferences.css`, {encoding:'UTF-8'});
          expect(output).toMatchSnapshot();
        });
      })
    });

    describe('scss/variables', () => {
      const output = fs.readFileSync(`${buildPath}border.scss`, {encoding:'UTF-8'});
      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.readFileSync(`${buildPath}borderWithReferences.scss`, {encoding:'UTF-8'});
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});