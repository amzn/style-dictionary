/*
 * Copyright Target Corporation. All Rights Reserved.
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
  describe('compose', () => {
    StyleDictionary.extend({
      source: [`__integration__/tokens/**/*.json?(c)`],
      platforms: {
        compose: {
          transformGroup: `compose`,
          buildPath,
          files: [{
            destination: "StyleDictionary.kt",
            format: "compose/object",
            className: "StyleDictionary",
            packageName: "com.example.tokens"
          },{
            destination: "StyleDictionaryWithReferences.kt",
            format: "compose/object",
            className: "StyleDictionary",
            packageName: "com.example.tokens",
            options: {
              outputReferences: true
            }
          }]
        },
      }
    }).buildAllPlatforms();

    describe(`compose/object`, () => {
      const output = fs.readFileSync(`${buildPath}StyleDictionary.kt`, {encoding:`UTF-8`});

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.readFileSync(`${buildPath}StyleDictionaryWithReferences.kt`, {encoding:`UTF-8`});

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