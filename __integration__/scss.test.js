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
const scss = require('node-sass');
const StyleDictionary = require('../index');


describe(`integration`, () => {
  describe(`scss`, () => {
    StyleDictionary.extend({
      source: [`__integration__/tokens/**/*.json`],
      platforms: {
        css: {
          transformGroup: `scss`,
          buildPath: `__integration__/build/`,
          files: [{
            destination: `variables.scss`,
            format: `scss/variables`
          },{
            destination: `variablesWithReferences.scss`,
            format: `scss/variables`,
            options: {
              keepReferences: true
            }
          },{
            destination: `map-flat.scss`,
            format: `scss/map-flat`
          },{
            destination: `map-deep.scss`,
            format: `scss/map-deep`
          }]
        }
      }
    }).buildAllPlatforms();

    describe(`scss/variables`, () => {
      const output = fs.readFileSync('__integration__/build/variables.scss', {encoding:'UTF-8'});

      it('should have a valid scss syntax', () => {
        const result = scss.renderSync({
          data: output,
        });
        expect(result.css).toBeDefined();
      });

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe('with keepReferences', () => {
        const output = fs.readFileSync('__integration__/build/variablesWithReferences.scss', {encoding:'UTF-8'});
        it('should have a valid scss syntax', () => {
          const result = scss.renderSync({
            data: output,
          });
          expect(result.css).toBeDefined();
        });

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });
      });
    });

    describe(`scss/map-flat`, () => {
      const output = fs.readFileSync('__integration__/build/map-flat.scss', {encoding:'UTF-8'});

      it('should have a valid scss syntax', () => {
        const result = scss.renderSync({
          data: output,
        });
        expect(result.css).toBeDefined();
      });

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });
    });

    describe(`scss/map-deep`, () => {
      const output = fs.readFileSync('__integration__/build/map-deep.scss', {encoding:'UTF-8'});

      it('should have a valid scss syntax', () => {
        const result = scss.renderSync({
          data: output,
        });
        expect(result.css).toBeDefined();
      });

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(`__integration__/build`);
});