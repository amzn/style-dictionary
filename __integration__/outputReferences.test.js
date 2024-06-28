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
import { restore, stubMethod } from 'hanbi';
import { buildPath, cleanConsoleOutput } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

describe('integration', () => {
  let stub;
  beforeEach(() => {
    stub = stubMethod(console, 'log');
  });

  afterEach(() => {
    clearOutput(buildPath);
    restore();
  });

  describe('output references', async () => {
    it('should warn the user if filters out references', async () => {
      const sd = new StyleDictionary({
        // we are only testing showFileHeader options so we don't need
        // the full source.
        source: [`__integration__/tokens/**/*.json?(c)`],
        platforms: {
          css: {
            transformGroup: 'css',
            buildPath,
            files: [
              {
                destination: 'filteredVariables.css',
                format: 'css/variables',
                // filter tokens and use outputReferences
                // Style Dictionary should build this file ok
                // but warn the user
                filter: (token) => token.attributes.type === 'background',
                options: {
                  outputReferences: true,
                },
              },
            ],
          },
        },
      });
      await sd.buildAllPlatforms();
      await expect(stub.lastCall.args.map(cleanConsoleOutput).join('\n')).to.matchSnapshot();
    });
  });
});
