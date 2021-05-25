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
const StyleDictionary = require('../index');
const {buildPath} = require('./_constants');

describe('integration', () => {
  describe('custom formats', () => {
    const styleDictionary = StyleDictionary.extend({
      source: [`__integration__/tokens/size/padding.json`],
      // Adding formats directly to SD
      format: {
        inlineCustomFormatWithOldArgs: (dictionary, platform, file) => {
          return JSON.stringify({dictionary, platform, file}, null, 2);
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
            otherOption: `platform option`
          },
          files: [{
            destination: 'inlineCustomFormatWithOldArgs.json',
            format: 'inlineCustomFormatWithOldArgs',
            options: {
              showFileHeader: true,
              otherOption: 'Test'
            }
          },{
            destination: 'inlineCustomFormatWithNewArgs.json',
            format: 'inlineCustomFormatWithNewArgs',
            options: {
              showFileHeader: true,
              otherOption: 'Test'
            }
          }]
        },
        customFormats: {
          transformGroup: 'js',
          buildPath,
          options: {
            otherOption: `platform option`
          },
          files: [{
            destination: 'registerCustomFormatWithOldArgs.json',
            format: 'registerCustomFormatWithOldArgs',
            options: {
              showFileHeader: true,
              otherOption: 'Test'
            }
          },{
            destination: 'registerCustomFormatWithNewArgs.json',
            format: 'registerCustomFormatWithNewArgs',
            options: {
              showFileHeader: true,
              otherOption: 'Test'
            }
          }]
        }
      }
    });

    styleDictionary.registerFormat({
      name: 'registerCustomFormatWithOldArgs',
      formatter: (dictionary, platform, file) => {
        return JSON.stringify({dictionary, platform, file}, null, 2);
      }
    });

    styleDictionary.registerFormat({
      name: 'registerCustomFormatWithNewArgs',
      formatter: (opts) => {
        return JSON.stringify(opts, null, 2);
      }
    });

    styleDictionary.buildAllPlatforms();

    describe(`inline custom with old args`, () => {
      const output = fs.readFileSync(`${buildPath}inlineCustomFormatWithOldArgs.json`, {encoding:'UTF-8'});

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file } = JSON.parse(output);
        expect(dictionary).toHaveProperty(`properties`);
        expect(dictionary).toHaveProperty(`allProperties`);
        expect(platform).toHaveProperty(`options.otherOption`, `platform option`);
        expect(file).toHaveProperty(`options.otherOption`, `Test`);
      });
    });

    describe(`inline custom with new args`, () => {
      const output = fs.readFileSync(`${buildPath}inlineCustomFormatWithNewArgs.json`, {encoding:'UTF-8'});
      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file, options } = JSON.parse(output);
        expect(dictionary).toHaveProperty(`properties`);
        expect(dictionary).toHaveProperty(`allProperties`);
        expect(platform).toHaveProperty(`options.otherOption`, `platform option`);
        expect(file).toHaveProperty(`options.otherOption`, `Test`);
        expect(options).toHaveProperty(`otherOption`, `Test`);
      });
    });


    describe(`register custom format with old args`, () => {
      const output = fs.readFileSync(`${buildPath}registerCustomFormatWithOldArgs.json`, {encoding:'UTF-8'});

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file } = JSON.parse(output);
        expect(dictionary).toHaveProperty(`properties`);
        expect(dictionary).toHaveProperty(`allProperties`);
        expect(platform).toHaveProperty(`options.otherOption`, `platform option`);
        expect(file).toHaveProperty(`options.otherOption`, `Test`);
      });
    });

    describe(`register custom format with new args`, () => {
      const output = fs.readFileSync(`${buildPath}registerCustomFormatWithNewArgs.json`, {encoding:'UTF-8'});

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      it(`should receive proper arguments`, () => {
        const { dictionary, platform, file, options } = JSON.parse(output);
        expect(dictionary).toHaveProperty(`properties`);
        expect(dictionary).toHaveProperty(`allProperties`);
        expect(platform).toHaveProperty(`options.otherOption`, `platform option`);
        expect(file).toHaveProperty(`options.otherOption`, `Test`);
        expect(options).toHaveProperty(`otherOption`, `Test`);
      });
    });

  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});