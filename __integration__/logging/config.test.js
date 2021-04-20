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
const StyleDictionary = require('../../index');
const {buildPath, cleanConsoleOutput} = require('../_constants');

// Spy on console.log and add all messages to an array
let consoleOutput = [];
const log = jest.spyOn(console, "log")
  .mockImplementation(message => consoleOutput.push(message))

/**
 * These integration tests will verify the behavior and logging at the *config*
 * level. These messages happen when `.extend()` is called to verify
 * proper configuration such as source being an array. This will also check
 * for collisions in source files and any errors that happen when parsing
 * and merging properties. This is the first of 3 phases of logging, the
 * next two are: platform and file.
 */
describe(`integration >`, () => {
  // before each test clear the mocked console.log and the output array
  beforeEach(() => {
    log.mockClear();
    consoleOutput = [];
  });

  describe(`logging >`, () => {
    describe(`config >`, () => {
      describe(`property value collisions`, () => {
        it(`should not throw, but notify users by default`, () => {
          StyleDictionary.extend({
            source: [
              // including a specific file twice will throw value collision warnings
              `__integration__/tokens/size/padding.json`,
              `__integration__/tokens/size/padding.json`
            ],
            platforms: {
            }
          });
          expect(consoleOutput.map(cleanConsoleOutput).join(`\n`)).toMatchSnapshot();
        });

        it(`should not show warnings if given higher log level`, () => {
          StyleDictionary.extend({
            logLevel: `error`,
            source: [
              // including a specific file twice will throw value collision warnings
              `__integration__/tokens/size/padding.json`,
              `__integration__/tokens/size/padding.json`
            ],
            platforms: {
            }
          });
          expect(consoleOutput.map(cleanConsoleOutput).join(`\n`)).toMatchSnapshot();
        });
      });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});