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
import { resolve } from '../lib/resolve.js';
import { buildPath } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

describe('integration', () => {
  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('flutter', async () => {
    const sd = new StyleDictionary({
      source: [`__integration__/tokens/**/[!_]*.json?(c)`],
      platforms: {
        flutter: {
          transformGroup: `flutter`,
          buildPath,
          files: [
            {
              destination: 'style_dictionary.dart',
              format: 'flutter/class.dart',
              className: 'StyleDictionary',
            },
            {
              destination: 'style_dictionary_with_references.dart',
              format: 'flutter/class.dart',
              className: 'StyleDictionary',
              options: {
                outputReferences: true,
              },
            },
          ],
        },
        flutter_separate: {
          transformGroup: `flutter-separate`,
          buildPath,
          files: [
            {
              destination: 'style_dictionary_color.dart',
              format: 'flutter/class.dart',
              className: 'StyleDictionaryColor',
              type: 'color',
              filter: {
                attributes: {
                  category: 'color',
                },
              },
            },
            {
              destination: 'style_dictionary_sizes.dart',
              format: 'flutter/class.dart',
              className: 'StyleDictionarySize',
              type: 'float',
              filter: {
                attributes: {
                  category: 'size',
                },
              },
            },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();

    describe(`flutter/class.dart`, () => {
      const output = fs.readFileSync(resolve(`${buildPath}style_dictionary.dart`), {
        encoding: `UTF-8`,
      });

      it(`should match snapshot`, async () => {
        await expect(output).to.matchSnapshot();
      });

      describe(`with references`, () => {
        const output = fs.readFileSync(
          resolve(`${buildPath}style_dictionary_with_references.dart`),
          {
            encoding: `UTF-8`,
          },
        );

        it(`should match snapshot`, async () => {
          await expect(output).to.matchSnapshot();
        });
      });

      describe(`separate`, () => {
        const output = fs.readFileSync(resolve(`${buildPath}style_dictionary_color.dart`), {
          encoding: `UTF-8`,
        });
        it(`should match snapshot`, async () => {
          await expect(output).to.matchSnapshot();
        });
      });
    });
  });
});
