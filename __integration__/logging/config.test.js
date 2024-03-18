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
import { restore, stubMethod } from 'hanbi';
import StyleDictionary from 'style-dictionary';
import { buildPath, cleanConsoleOutput } from '../_constants.js';
import { clearOutput } from '../../__tests__/__helpers.js';

/**
 * These integration tests will verify the behavior and logging at the *config*
 * level. These messages happen when `.extend()` is called to verify
 * proper configuration such as source being an array. This will also check
 * for collisions in source files and any errors that happen when parsing
 * and merging tokens. This is the first of 3 phases of logging, the
 * next two are: platform and file.
 */
describe(`integration >`, () => {
  let stub;
  beforeEach(() => {
    stub = stubMethod(console, 'log');
  });
  afterEach(() => {
    restore();
    clearOutput(buildPath);
  });

  describe(`logging >`, () => {
    describe(`config >`, () => {
      describe(`property value collisions`, () => {
        it(`should not throw, but notify users by default`, async () => {
          const sd = new StyleDictionary({
            source: [
              // including a specific file twice will throw value collision warnings
              `__integration__/tokens/size/padding.json`,
              `__integration__/tokens/size/_padding.json`,
            ],
            platforms: {},
          });
          await sd.hasInitialized;
          const consoleOutput = stub.firstCall.args.map(cleanConsoleOutput).join('\n');
          await expect(consoleOutput).to.matchSnapshot();
        });

        it(`should not log anything if the log verbosity is set to silent`, async () => {
          const sd = new StyleDictionary({
            log: {
              verbosity: 'silent',
            },
            source: [
              // including a specific file twice will throw value collision warnings
              `__integration__/tokens/size/padding.json`,
              `__integration__/tokens/size/_padding.json`,
            ],
            platforms: {},
          });
          await sd.hasInitialized;
          await expect(stub.callCount).to.equal(0);
        });

        it(`should not show warnings if given higher log level`, async () => {
          const sd = new StyleDictionary(
            {
              log: { warnings: `error` },
              source: [
                // including a specific file twice will throw value collision warnings
                `__integration__/tokens/size/padding.json`,
                `__integration__/tokens/size/_padding.json`,
              ],
              platforms: {},
            },
            { init: false },
          );

          let error;
          try {
            await sd.init();
          } catch (e) {
            error = e;
          }

          await expect(error.message).to.matchSnapshot();
          expect(stub.called).to.be.false;
        });
      });
    });
  });
});
