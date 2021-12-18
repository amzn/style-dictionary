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
  describe('swift', () => {
    StyleDictionary.extend({
      source: [`__integration__/tokens/**/*.json?(c)`],
      platforms: {
        flutter: {
          transformGroup: `ios-swift`,
          buildPath,
          files: [{
            destination: "style_dictionary.swift",
            format: "ios-swift/class.swift",
            className: "StyleDictionary"
          },{
            destination: "style_dictionary_with_references.swift",
            format: "ios-swift/class.swift",
            className: "StyleDictionary",
            options: {
              outputReferences: true
            }
          }]
        },
      }
    }).buildAllPlatforms();

    describe(`ios-swift/class.swift`, () => {
      const output = fs.readFileSync(`${buildPath}style_dictionary.swift`, {encoding:`UTF-8`});

      it(`should match snapshot`, () => {
        expect(output).toMatchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.readFileSync(`${buildPath}style_dictionary_with_references.swift`, {encoding:`UTF-8`});

        it(`should match snapshot`, () => {
          expect(output).toMatchSnapshot();
        });

      });

      // describe(`separate`, () => {
      //   const output = fs.readFileSync(`${buildPath}style_dictionary_color.dart`);
      //   it(`should match snapshot`, () => {
      //     expect(output).toMatchSnapshot();
      //   });
      // });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});