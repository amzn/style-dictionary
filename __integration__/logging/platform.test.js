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
 * This is the 2nd phase of logging: the platform configuration. This happens
 * after the Style Dictionary configuration is verified and property files are
 * parsed and merged. The platform configuration phase will verify the configuration
 * of the platform and turn references to transforms, transformGroups, formats,
 * and actions into their actual implementation. This phase may warn or throw
 * an error if a user tries to use an unknown transform.
 *
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
    describe(`platform`, () => {
      it(`should throw and notify users of unknown actions`, async () => {
        const sd = new StyleDictionary({
          tokens: {},
          platforms: {
            css: {
              actions: [`foo`],
            },
          },
        });
        // unknown actions should throw
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

      it(`should throw and notify users of unknown transforms`, async () => {
        const sd = new StyleDictionary({
          platforms: {
            css: {
              transforms: [`foo`, `bar`],
            },
          },
        });
        // unknown actions should throw
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

      it(`should throw and notify users of unknown transformGroups`, async () => {
        const sd = new StyleDictionary({
          platforms: {
            css: {
              transformGroup: `foo`,
            },
          },
        });
        // unknown actions should throw
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

      describe(`property reference errors`, () => {
        it(`should throw and notify users of unknown references`, async () => {
          const sd = new StyleDictionary({
            tokens: {
              color: {
                danger: { value: '{color.red.value}' },
              },
            },
            platforms: {
              css: {},
            },
          });
          // unknown actions should throw
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

        it(`circular references should throw and notify users`, async () => {
          const sd = new StyleDictionary({
            tokens: {
              color: {
                foo: { value: '{color.foo.value}' },
                teal: { value: '{color.blue.value}' },
                blue: { value: '{color.green.value}' },
                green: { value: '{color.teal.value}' },
                purple: { value: '{color.teal.value}' },
              },
            },
            platforms: {
              css: {},
            },
          });
          // unknown actions should throw
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
