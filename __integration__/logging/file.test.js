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
      it(`should warn user empty tokens`, async () => {
        const sd = new StyleDictionary({
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              transformGroup: `css`,
              files: [
                {
                  destination: `empty.css`,
                  format: `css/variables`,
                  filter: (token) => token.attributes.category === `foo`,
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

      it(`should warn user of name collisions`, async () => {
        const sd = new StyleDictionary({
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              // no name transform means there will be name collisions
              transforms: [`attribute/cti`],
              buildPath,
              files: [
                {
                  destination: `nameCollisions.css`,
                  format: `css/variables`,
                  filter: (token) => token.attributes.category === `color`,
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

      it(`should not warn user of name collisions with log level set to error`, async () => {
        const sd = new StyleDictionary({
          log: `error`,
          source: [`__integration__/tokens/**/*.json?(c)`],
          platforms: {
            css: {
              // no name transform means there will be name collisions
              transforms: [`attribute/cti`],
              buildPath,
              files: [
                {
                  destination: `nameCollisions.css`,
                  format: `css/variables`,
                  filter: (token) => token.attributes.category === `color`,
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

      it(`should warn user of filtered references`, async () => {
        const sd = new StyleDictionary({
          source: [`__integration__/tokens/**/*.json?(c)`],
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

      it(`should not warn user of filtered references with log level set to error`, async () => {
        const sd = new StyleDictionary({
          log: `error`,
          source: [`__integration__/tokens/**/*.json?(c)`],
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
