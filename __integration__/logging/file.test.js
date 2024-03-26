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
 * The last and final level of logging: file.
 * These logs happen when a file is being built and will notify the user
 * if there are issues generating a file. These issues might include
 * skipping building an empty file, property name collisions, or filtered
 * out references.
 */
describe(`integration`, () => {
  let stub;
  beforeEach(() => {
    stub = stubMethod(console, 'log');
  });
  afterEach(() => {
    restore();
    clearOutput(buildPath);
  });

  describe(`logging`, () => {
    describe(`file`, () => {
      describe('empty tokens', () => {
        it(`should warn user about empty tokens`, async () => {
          const sd = new StyleDictionary({
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                files: [
                  {
                    destination: `empty.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `foo`,
                  },
                ],
              },
            },
          });

          await sd.buildAllPlatforms();
          const logs = Array.from(stub.calls).flatMap((call) => call.args);
          const consoleOutput = logs.map(cleanConsoleOutput).join('\n');
          await expect(consoleOutput).to.matchSnapshot();
        });

        it(`should not warn user about empty tokens with silent log verbosity`, async () => {
          const sd = new StyleDictionary({
            log: { verbosity: 'silent' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                files: [
                  {
                    destination: `empty.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `foo`,
                  },
                ],
              },
            },
          });

          await sd.buildAllPlatforms();
          expect(stub.callCount).to.equal(0);
        });

        it(`should not warn user about empty tokens with silent log verbosity`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: 'disabled' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                files: [
                  {
                    destination: `empty.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `foo`,
                  },
                ],
              },
            },
          });

          await sd.buildAllPlatforms();
          // 1 due to success log "css"
          expect(stub.callCount).to.equal(1);
        });

        it(`should not warn user about empty tokens with log level set to error`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: 'error' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                files: [
                  {
                    destination: `empty.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `foo`,
                  },
                ],
              },
            },
          });

          await expect(sd.buildAllPlatforms()).to.eventually.rejectedWith(
            'No tokens for empty.css. File not created.',
          );
        });

        it(`should not warn user about empty tokens with log level set to error on platform level`, async () => {
          const sd = new StyleDictionary({
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                log: { warnings: 'error' },
                transformGroup: `css`,
                files: [
                  {
                    destination: `empty.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `foo`,
                  },
                ],
              },
            },
          });

          await expect(sd.buildAllPlatforms()).to.eventually.rejectedWith(
            'No tokens for empty.css. File not created.',
          );
        });
      });

      describe('name collisions', () => {
        it(`should warn users briefly of name collisions by default`, async () => {
          const sd = new StyleDictionary({
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          const logs = Array.from(stub.calls).flatMap((call) => call.args);
          const consoleOutput = logs.map(cleanConsoleOutput).join('\n');
          await expect(consoleOutput).to.matchSnapshot();
        });

        it(`should not warn user of name collisions with log verbosity silent`, async () => {
          const sd = new StyleDictionary({
            log: { verbosity: 'silent' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          expect(stub.callCount).to.equal(0);
        });

        it(`should not warn user of name collisions with log verbosity silent`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: 'disabled' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          // 1 due to success log "css"
          expect(stub.callCount).to.equal(1);
        });

        it(`should throw a brief error of name collisions with log level set to error`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: `error` },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
          // only log is the platform name at the start of the buildPlatform method
          expect(stub.callCount).to.equal(1);
          expect(stub.firstCall.args).to.eql(['\ncss']);
        });

        it(`should throw a brief error of name collisions with log level set to error on platform level`, async () => {
          const sd = new StyleDictionary({
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                log: { warnings: `error` },
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
          // only log is the platform name at the start of the buildPlatform method
          expect(stub.callCount).to.equal(1);
          expect(stub.firstCall.args).to.eql(['\ncss']);
        });

        it(`should warn user of name collisions with a detailed message through "verbose" verbosity`, async () => {
          const sd = new StyleDictionary({
            log: { verbosity: 'verbose' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          const logs = Array.from(stub.calls).flatMap((call) => call.args);
          const consoleOutput = logs.map(cleanConsoleOutput).join('\n');
          await expect(consoleOutput).to.matchSnapshot();
        });

        it(`should throw detailed error of name collisions through "verbose" verbosity and log level set to error`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: `error`, verbosity: 'verbose' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                // no name transform means there will be name collisions
                transforms: [`attribute/cti`],
                buildPath,
                files: [
                  {
                    destination: `nameCollisions.css`,
                    format: `css/variables`,
                    filter: (token) => token.type === `color`,
                  },
                ],
              },
            },
          });
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
          // only log is the platform name at the start of the buildPlatform method
          expect(stub.callCount).to.equal(1);
          expect(stub.firstCall.args).to.eql(['\ncss']);
        });
      });

      describe('filtered references', () => {
        it(`should warn users briefly of filtered references by default`, async () => {
          const sd = new StyleDictionary({
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          const logs = Array.from(stub.calls).flatMap((call) => call.args);
          const consoleOutput = logs.map(cleanConsoleOutput).join('\n');
          await expect(consoleOutput).to.matchSnapshot();
        });

        it(`should not warn user of filtered references with log verbosity silent`, async () => {
          const sd = new StyleDictionary({
            log: { verbosity: 'silent' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          expect(stub.callCount).to.equal(0);
        });

        it(`should not warn user of filtered references with log verbosity silent`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: 'disabled' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          // 1 due to success log "css"
          expect(stub.callCount).to.equal(1);
        });

        it(`should throw a brief error of filtered references with log level set to error`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: `error` },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
          // only log is the platform name at the start of the buildPlatform method
          expect(stub.callCount).to.equal(1);
          expect(stub.firstCall.args).to.eql(['\ncss']);
        });

        it(`should throw a brief error of filtered references with log level set to error on platform level`, async () => {
          const sd = new StyleDictionary({
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                log: { warnings: `error` },
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
          // only log is the platform name at the start of the buildPlatform method
          expect(stub.callCount).to.equal(1);
          expect(stub.firstCall.args).to.eql(['\ncss']);
        });

        it(`should warn user of filtered references with a detailed message through "verbose" verbosity`, async () => {
          const sd = new StyleDictionary({
            log: { verbosity: 'verbose' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          await sd.buildAllPlatforms();
          const logs = Array.from(stub.calls).flatMap((call) => call.args);
          const consoleOutput = logs.map(cleanConsoleOutput).join('\n');
          await expect(consoleOutput).to.matchSnapshot();
        });

        it(`should throw detailed error of filtered references through "verbose" verbosity and log level set to error`, async () => {
          const sd = new StyleDictionary({
            log: { warnings: `error`, verbosity: 'verbose' },
            source: [`__integration__/tokens/**/[!_]*.json?(c)`],
            platforms: {
              css: {
                transformGroup: `css`,
                buildPath,
                files: [
                  {
                    destination: `filteredReferences.css`,
                    format: `css/variables`,
                    options: {
                      outputReferences: true,
                    },
                    // background colors have references, only including them
                    // should warn the user
                    filter: (token) => token.attributes.type === `background`,
                  },
                ],
              },
            },
          });
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
          // only log is the platform name at the start of the buildPlatform method
          expect(stub.callCount).to.equal(1);
          expect(stub.firstCall.args).to.eql(['\ncss']);
        });
      });
    });
  });
});
