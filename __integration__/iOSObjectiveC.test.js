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
  describe('ios objective-c', () => {
    StyleDictionary.extend({
      source: [`__integration__/tokens/**/*.json?(c)`],
      platforms: {
        flutter: {
          transformGroup: `ios`,
          buildPath,
          files: [{
            destination: "singleton.m",
            format: "ios/singleton.m",
            className: "StyleDictionary"
          },{
            destination: "singleton.h",
            format: "ios/singleton.h",
            className: "StyleDictionary"
          },{
            destination: "color.h",
            format: "ios/colors.h",
            className: "StyleDictionaryColor",
            type: "StyleDictionaryColorName",
            filter: (token) => token.attributes.category === 'color'
          },{
            destination: "color.m",
            format: "ios/colors.m",
            className: "StyleDictionaryColor",
            type: "StyleDictionaryColorName",
            filter: (token) => token.attributes.category === 'color'
          },{
            destination: "macros.h",
            format: "ios/macros",
          },{
            destination: "static.h",
            format: "ios/static.h",
            className: "StyleDictionaryStatic",
            type: "CGFloat",
            filter: (token) => token.attributes.category === 'size'
          },{
            destination: "static.m",
            format: "ios/static.m",
            className: "StyleDictionaryStatic",
            type: "CGFloat",
            filter: (token) => token.attributes.category === 'size'
          }]
        },
      }
    }).buildAllPlatforms();

    it(`ios/singleton.m should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}singleton.m`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });

    it(`ios/singleton.h should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}singleton.h`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });

    it(`ios/color.m should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}color.m`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });

    it(`ios/color.h should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}color.h`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });

    it(`ios/macros.h should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}macros.h`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });

    it(`ios/static.h should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}static.h`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });

    it(`ios/static.m should match snapshot`, () => {
      const output = fs.readFileSync(`${buildPath}static.m`, {encoding:`UTF-8`});
      expect(output).toMatchSnapshot();
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});