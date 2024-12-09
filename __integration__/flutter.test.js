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
import { formats, transformGroups } from '../lib/enums/index.js';

const { flutterClassDart } = formats;
const { flutter, flutterSeparate } = transformGroups;

describe('integration', async () => {
  before(async () => {
    const sd = new StyleDictionary({
      source: [`__integration__/tokens/**/[!_]*.json?(c)`],
      platforms: {
        flutter: {
          transformGroup: flutter,
          buildPath,
          files: [
            {
              destination: 'style_dictionary.dart',
              format: flutterClassDart,
              options: {
                className: 'StyleDictionary',
              },
            },
            {
              destination: 'style_dictionary_with_references.dart',
              format: flutterClassDart,
              options: {
                outputReferences: true,
                className: 'StyleDictionary',
              },
            },
          ],
        },
        flutter_separate: {
          transformGroup: flutterSeparate,
          buildPath,
          files: [
            {
              destination: 'style_dictionary_color.dart',
              format: flutterClassDart,
              options: {
                className: 'StyleDictionaryColor',
                type: 'color',
              },
              filter: {
                type: 'color',
              },
            },
            {
              destination: 'style_dictionary_sizes.dart',
              format: flutterClassDart,
              options: {
                className: 'StyleDictionarySize',
                type: 'float',
              },
              filter: {
                type: 'color',
              },
            },
          ],
        },
      },
    });
    await sd.buildAllPlatforms();
  });

  afterEach(() => {
    clearOutput(buildPath);
  });

  describe('flutter', async () => {
    describe(`flutter/class.dart`, async () => {
      it(`should match snapshot`, async () => {
        const output = fs.readFileSync(resolve(`${buildPath}style_dictionary.dart`), {
          encoding: `UTF-8`,
        });
        await expect(output).to.matchSnapshot();
      });

      describe(`with references`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(
            resolve(`${buildPath}style_dictionary_with_references.dart`),
            {
              encoding: `UTF-8`,
            },
          );
          await expect(output).to.matchSnapshot();
        });
      });

      describe(`separate`, async () => {
        it(`should match snapshot`, async () => {
          const output = fs.readFileSync(resolve(`${buildPath}style_dictionary_color.dart`), {
            encoding: `UTF-8`,
          });
          await expect(output).to.matchSnapshot();
        });
      });
    });
  });
});
