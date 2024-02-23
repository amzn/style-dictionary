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
import { stubMethod, restore } from 'hanbi';
import { buildPath, cleanConsoleOutput } from './_constants.js';
import { clearOutput } from '../__tests__/__helpers.js';

const tokens = {
  color: {
    red: { value: '#f00' },
    background: {
      red: { value: '{color.red.value}' },
    },
  },
};

describe('integration', async () => {
  let stub;
  beforeEach(() => {
    stub = stubMethod(console, 'log');
  });

  afterEach(() => {
    clearOutput(buildPath);
    restore();
  });

  describe('name collisions', async () => {
    it(`should warn users of name collisions for flat files`, async () => {
      const sd = new StyleDictionary({
        // we are only testing name collision warnings options so we don't need
        // the full source.
        tokens,
        platforms: {
          web: {
            buildPath,
            files: [
              {
                destination: 'variables.css',
                format: 'css/variables',
              },
            ],
          },
        },
      });
      await sd.buildAllPlatforms();
      await expect(stub.lastCall.args.map(cleanConsoleOutput).join('\n')).to.matchSnapshot();
    });

    it(`should not warn users of name collisions for nested files`, async () => {
      const sd = new StyleDictionary({
        // we are only testing name collision warnings options so we don't need
        // the full source.
        tokens,
        platforms: {
          web: {
            buildPath,
            files: [
              {
                destination: 'tokens.json',
                format: 'json/nested',
              },
            ],
          },
        },
      });
      await sd.buildAllPlatforms();
      expect(stub.lastCall.args.map(cleanConsoleOutput).join('\n')).to.equal(
        `✔︎ ${buildPath}tokens.json`,
      );
    });
  });
});
