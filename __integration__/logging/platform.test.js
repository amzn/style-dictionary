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
 * This is the 2nd phase of logging: the platform configuration. This happens
 * after the Style Dictionary configuration is verified and property files are
 * parsed and merged. The platform configuration phase will verify the configuration
 * of the platform and turn references to transforms, transformGroups, formats,
 * and actions into their actual implementation. This phase may warn or throw
 * an error if a user tries to use an unknown transform.
 *
 */
describe(`integration`, () => {
  // before each test clear the mocked console.log and the output array
  beforeEach(() => {
    log.mockClear();
    consoleOutput = [];
  });

  describe(`logging`, () => {
    describe(`platform`, () => {
      it(`should throw and notify users of unknown actions`, () => {
        // unknown actions should throw
        expect(() => {
          StyleDictionary.extend({
            properties: {},
            platforms: {
              css: {
                actions: [`foo`]
              }
            }
          }).buildAllPlatforms();
        }).toThrow();
        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });

      it(`should throw and notify users of unknown transforms`, () => {
        expect(() => {
          StyleDictionary.extend({
            platforms: {
              css: {
                transforms: [`foo`,`bar`]
              }
            }
          }).buildAllPlatforms();
        }).toThrow();
        expect(consoleOutput.map(cleanConsoleOutput).join(`\n`)).toMatchSnapshot();
      });

      it(`should throw and notify users of unknown transformGroups`, () => {
        expect(() => {
          StyleDictionary.extend({
            platforms: {
              css: {
                transformGroup: `foo`
              }
            }
          }).buildAllPlatforms();
        }).toThrow();
        expect(consoleOutput.map(cleanConsoleOutput).join(`\n`)).toMatchSnapshot();
      });

      describe(`property reference errors`, () => {
        it(`should throw and notify users of unknown references`, () => {
          expect(() => {
            StyleDictionary.extend({
              properties: {
                color: {
                  danger: { value: "{color.red.value}" },
                }
              },
              platforms: {
                css: {}
              }
            }).buildAllPlatforms();
          }).toThrow();
          expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
        });

        it(`circular references should throw notify users`, () => {
          expect(() => {
            StyleDictionary.extend({
              properties: {
                color: {
                  foo: { value: "{color.foo.value}" },
                  teal: { value: "{color.blue.value}" },
                  blue: { value: "{color.green.value}" },
                  green: { value: "{color.teal.value}" },
                  purple: { value: "{color.teal.value}" }
                }
              },
              platforms: {
                css: {}
              }
            }).buildAllPlatforms();
          }).toThrow();
          expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
        });
      });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});