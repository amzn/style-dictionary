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
 * The last and final level of logging: file.
 * These logs happen when a file is being built and will notify the user
 * if there are issues generating a file. These issues might include
 * skipping building an empty file, property name collisions, or filtered
 * out references.
 */
describe(`integration`, () => {
  // before each test clear the mocked console.log and the output array
  beforeEach(() => {
    log.mockClear();
    consoleOutput = [];
  });

  describe(`logging`, () => {
    describe(`file`, () => {
      it(`should warn user empty properties`, () => {
        StyleDictionary.extend({
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              transformGroup: `css`,
              files: [{
                destination: `empty.css`,
                format: `css/variables`,
                filter: (token) => token.attributes.category === `foo`
              }]
            }
          }
        }).buildAllPlatforms();

        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });

      it(`should not warn user of empty properties with log level set to error`, () => {
        StyleDictionary.extend({
          logLevel: `error`,
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              transformGroup: `css`,
              files: [{
                destination: `empty.css`,
                format: `css/variables`,
                filter: (token) => token.attributes.category === `foo`
              }]
            }
          }
        }).buildAllPlatforms();
        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });

      it(`should warn user of name collisions`, () => {
        StyleDictionary.extend({
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              // no name transform means there will be name collisions
              transforms: [`attribute/cti`],
              buildPath,
              files: [{
                destination: `nameCollisions.css`,
                format: `css/variables`,
                filter: (token) => token.attributes.category === `color`
              }]
            }
          }
        }).buildAllPlatforms();
        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });

      it(`should not warn user of name collisions with log level set to error`, () => {
        StyleDictionary.extend({
          logLevel: `error`,
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              // no name transform means there will be name collisions
              transforms: [`attribute/cti`],
              buildPath,
              files: [{
                destination: `nameCollisions.css`,
                format: `css/variables`,
                filter: (token) => token.attributes.category === `color`
              }]
            }
          }
        }).buildAllPlatforms();
        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });

      it(`should warn user of filtered references`, () => {
        StyleDictionary.extend({
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              transformGroup: `css`,
              buildPath,
              files: [{
                destination: `filteredReferences.css`,
                format: `css/variables`,
                options: {
                  outputReferences: true
                },
                // background colors have references, only including them
                // should warn the user
                filter: (token) => token.attributes.type === `background`
              }]
            }
          }
        }).buildAllPlatforms();
        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });

      it(`should not warn user of filtered references with log level set to error`, () => {
        StyleDictionary.extend({
          logLevel: `error`,
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              transformGroup: `css`,
              buildPath,
              files: [{
                destination: `filteredReferences.css`,
                format: `css/variables`,
                options: {
                  outputReferences: true
                },
                // background colors have references, only including them
                // should warn the user
                filter: (token) => token.attributes.type === `background`
              }]
            }
          }
        }).buildAllPlatforms();
        expect(consoleOutput.map(cleanConsoleOutput).join('\n')).toMatchSnapshot();
      });
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});