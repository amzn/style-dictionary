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
  describe('css', () => {
    StyleDictionary.extend({
      source: [`__integration__/tokens/**/*.json?(c)`],
      // Testing proper string interpolation with multiple references here.
      // This is a CSS/web-specific thing so only including them in this
      // integration test.
      properties: {
        breakpoint: {
          xs: { value: "304px" },
          sm: { value: "768px" },
          md: { value: "calc({breakpoint.xs.value} / {breakpoint.sm.value})"}
        }
      },
      platforms: {
        css: {
          transformGroup: 'css',
          buildPath,
          files: [{
            destination: 'variables.css',
            format: 'css/variables'
          },{
            destination: 'variablesWithReferences.css',
            format: 'css/variables',
            options: {
              outputReferences: true,
              outputReferenceFallbacks: true
            }
          },{
            destination: 'variablesWithSelector.css',
            format: 'css/variables',
            options: {
              selector: '.test'
            }
          }]
        }
      }
    }).buildAllPlatforms();

    describe('css/variables', () => {
      const output = fs.readFileSync(`${buildPath}variables.css`, {encoding:'UTF-8'});
      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.readFileSync(`${buildPath}variablesWithReferences.css`, {encoding:'UTF-8'});
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });

      describe(`with selector`, () => {
        const output = fs.readFileSync(`${buildPath}variablesWithSelector.css`, {encoding:'UTF-8'});
        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });

      // TODO: add css validator
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});