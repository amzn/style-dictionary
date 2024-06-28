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
import StyleDictionary from 'style-dictionary';
import { fs } from 'style-dictionary/fs';
import { buildPath } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

describe('integration', () => {
  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('swift', async () => {
    const sd = new StyleDictionary({
      source: [`__integration__/tokens/**/*.json?(c)`],
      platforms: {
        flutter: {
          transformGroup: `ios-swift`,
          buildPath,
          files: [
            {
              destination: 'style_dictionary.swift',
              format: 'ios-swift/class.swift',
              className: 'StyleDictionary',
            },
            {
              destination: 'style_dictionary_with_references.swift',
              format: 'ios-swift/class.swift',
              className: 'StyleDictionary',
              options: {
                outputReferences: true,
              },
            },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();

    describe(`ios-swift/class.swift`, () => {
      const output = fs.readFileSync(`${buildPath}style_dictionary.swift`, {
        encoding: `UTF-8`,
      });

      it(`should match snapshot`, async () => {
        await expect(output).to.matchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.readFileSync(`${buildPath}style_dictionary_with_references.swift`, {
          encoding: `UTF-8`,
        });

        it(`should match snapshot`, async () => {
          await expect(output).to.matchSnapshot();
        });
      });

      // describe(`separate`, () => {
      //   const output = fs.readFileSync(`${buildPath}style_dictionary_color.dart`);
      //   it(`should match snapshot`, async () => {
      //     await expect(output).to.matchSnapshot();
      //   });
      // });
    });
  });
});
