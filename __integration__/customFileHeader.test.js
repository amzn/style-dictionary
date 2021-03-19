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

describe(`integration`, () => {
  describe(`valid custom file headers`, () => {
    // Adding a custom file header with the `.registerFileHeader`
    StyleDictionary.registerFileHeader({
      name: `registeredFileHeader`,
      fileHeader: (defaultMessage) => {
        return [
          `hello`,
          ...defaultMessage
        ]
      }
    });

    StyleDictionary.extend({
      fileHeader: {
        configFileHeader: (defaultMessage) => {
          return [
            ...defaultMessage,
            'hello, world!'
          ];
        }
      },

      // only testing the file header in these tests so we are
      // using a small properties object with a single token
      properties: {
        color: {
          red: { value: '#ff0000' }
        }
      },

      platforms: {
        css: {
          transformGroup: `css`,
          buildPath,
          files: [{
            destination: `registeredFileHeader.css`,
            format: `css/variables`,
            options: {
              fileHeader: `registeredFileHeader`
            }
          },{
            destination: `configFileHeader.css`,
            format: `css/variables`,
            options: {
              fileHeader: `configFileHeader`
            }
          },{
            destination: `inlineFileHeader.css`,
            format: `css/variables`,
            options: {
              fileHeader: () => {
                return [
                  `build version 1.0.0`
                ]
              }
            }
          }]
        },
        js: {
          transformGroup: `js`,
          buildPath,
          options: {
            fileHeader: `configFileHeader`
          },
          files: [{
            destination: `noOptions.js`,
            format: `javascript/module`
          },{
            destination: `showFileHeader.js`,
            format: `javascript/module`,
            options: {
              showFileHeader: false
            }
          },{
            destination: `fileHeaderOverride.js`,
            format: `javascript/module`,
            options: {
              fileHeader: () => [`Header overridden`]
            }
          }]
        }
      }
    }).buildAllPlatforms();

    describe('file options', () => {
      it(`registered file header should match snapshot`, () => {
        const output = fs.readFileSync(`${buildPath}registeredFileHeader.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });

      it(`config file header should match snapshot`, () => {
        const output = fs.readFileSync(`${buildPath}configFileHeader.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });

      it(`inline file header should match snapshot`, () => {
        const output = fs.readFileSync(`${buildPath}inlineFileHeader.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });
    });

    describe('platform options', () => {
      it(`no file options should match snapshot`, () => {
        const output = fs.readFileSync(`${buildPath}noOptions.js`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });

      it(`showFileHeader should match snapshot`, () => {
        const output = fs.readFileSync(`${buildPath}showFileHeader.js`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });

      it(`file header override should match snapshot`, () => {
        const output = fs.readFileSync(`${buildPath}fileHeaderOverride.js`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });
    });
  });
  describe(`invalid custom file headers`, () => {
    it(`should throw if trying to use an undefined file header`, () => {
      expect(() => {
        StyleDictionary.extend({
          platforms: {
            css: {
              buildPath,
              files: [{
                destination: `variables.css`,
                options: {
                  fileHeader: `nonexistentFileHeader`
                }
              }]
            }
          }
        }).buildAllPlatforms();
      }).toThrow(`Can't find fileHeader: nonexistentFileHeader`);
    });
  });
});
