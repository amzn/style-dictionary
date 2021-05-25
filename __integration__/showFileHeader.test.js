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
  describe('showFileHeader', () => {
    StyleDictionary.extend({
      // we are only testing showFileHeader options so we don't need
      // the full source.
      source: [`__integration__/tokens/size/padding.json`],
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath,
          files: [{
            destination: 'platform-none-file-none.css',
            format: 'css/variables'
          },{
            destination: 'platform-none-file-false.css',
            format: 'css/variables',
            options: {
              showFileHeader: false
            }
          }]
        },
        fileHeader: {
          transformGroup: 'css',
          buildPath,
          options: {
            showFileHeader: false
          },
          files: [{
            destination: 'platform-false-file-none.css',
            format: 'css/variables'
          },{
            destination: 'platform-false-file-true.css',
            format: 'css/variables',
            options: {
              showFileHeader: true
            }
          }]
        }
      }
    }).buildAllPlatforms();

    describe(`without platform options`, () => {
      it(`should show file header if no file options set`, () => {
        const output = fs.readFileSync(`${buildPath}platform-none-file-none.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });

      it(`should not show file header if file options set to false`, () => {
        const output = fs.readFileSync(`${buildPath}platform-none-file-false.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });
    });

    describe(`with platform options set to false`, () => {
      it(`should not show file header if no file options set`, () => {
        const output = fs.readFileSync(`${buildPath}platform-false-file-none.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });

      it(`should show file header if file options set to true`, () => {
        const output = fs.readFileSync(`${buildPath}platform-false-file-true.css`, {encoding:'UTF-8'});
        expect(output).toMatchSnapshot();
      });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});