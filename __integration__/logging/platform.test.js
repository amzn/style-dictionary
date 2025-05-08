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
import { buildPath, cleanConsoleOutput } from '../_constants.js';
import { clearOutput } from '../../__tests__/__helpers.js';
import { restore, stubMethod } from 'hanbi';
import { logVerbosityLevels } from '../../lib/enums/logVerbosityLevels.js';

const { verbose } = logVerbosityLevels;

/**
 * @typedef {import('../../types/ReferenceError.d.ts').ReferenceError} RefError
 */

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
      });

      it(`should warn and notify users of transform errors`, async () => {
        const stub = stubMethod(console, 'log');
        const sd = new StyleDictionary({
          hooks: {
            transforms: {
              'error-transform': {
                type: 'value',
                filter: (token) => token.type === 'color',
                transform: (token) => {
                  return token.value.replace('', '');
                },
              },
            },
          },
          tokens: {
            colors: {
              red: {
                value: 123,
                type: 'color',
              },
            },
          },
          platforms: {
            css: {
              buildPath: '__tests__/__output/',
              transforms: [`error-transform`],
              files: [{ destination: 'foo.css', format: 'css/variables' }],
            },
          },
        });
        await sd.buildAllPlatforms();
        const firstLog = [...stub.calls][0].args[0];
        await expect(cleanConsoleOutput(firstLog)).to.matchSnapshot(1);

        sd.log.verbosity = 'verbose';
        await sd.buildAllPlatforms({ cache: false });
        // we skip 1 and 2 because those are success logs from building the tokens in the previous run
        const secondLog = [...stub.calls][3].args[0];
        await expect(cleanConsoleOutput(secondLog).split('Object.transform')[0]).to.matchSnapshot(
          2,
        );
      });

      describe(`token reference errors`, () => {
        it(`should throw and notify users of unknown references`, async () => {
          const sd = new StyleDictionary({
            tokens: {
              color: {
                danger: { value: '{color.red}' },
              },
            },
            platforms: {
              css: {},
            },
          });
          // unknown actions should throw
          /** @type {RefError} */
          let error;
          try {
            await sd.buildAllPlatforms();
          } catch (e) {
            error = e;
          }

          expect(error.errors).to.eql([
            {
              ref: '{color.red}',
              token: {
                attributes: {},
                key: '{color.danger}',
                name: 'danger',
                original: {
                  value: '{color.red}',
                },
                path: ['color', 'danger'],
                value: '{color.red}',
                refs: ['{color.red}'],
              },
              type: 'not-found',
            },
          ]);
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
        });

        it(`should throw and notify users of unknown references verbose mode`, async () => {
          const sd = new StyleDictionary({
            log: {
              verbosity: verbose,
            },
            tokens: {
              color: {
                danger: { value: '{color.red}' },
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
          expect(error.errors).to.eql([
            {
              ref: '{color.red}',
              token: {
                attributes: {},
                key: '{color.danger}',
                name: 'danger',
                original: {
                  value: '{color.red}',
                },
                path: ['color', 'danger'],
                value: '{color.red}',
                refs: ['{color.red}'],
              },
              type: 'not-found',
            },
          ]);
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
        });

        it(`circular references should throw and notify users`, async () => {
          const sd = new StyleDictionary({
            tokens: {
              color: {
                foo: { value: '{color.foo}' },
                teal: { value: '{color.blue}' },
                blue: { value: '{color.green}' },
                green: { value: '{color.teal}' },
                purple: { value: '{color.teal}' },
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
        });

        it(`circular references should throw and notify users verbose mode`, async () => {
          const sd = new StyleDictionary({
            log: {
              verbosity: verbose,
            },
            tokens: {
              color: {
                foo: { value: '{color.foo}' },
                teal: { value: '{color.blue}' },
                blue: { value: '{color.green}' },
                green: { value: '{color.teal}' },
                purple: { value: '{color.teal}' },
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
          expect(error.errors).to.eql([
            {
              ref: '{color.foo}',
              token: {
                attributes: {},
                key: '{color.foo}',
                name: 'foo',
                original: {
                  value: '{color.foo}',
                },
                path: ['color', 'foo'],
                value: '{color.foo}',
                refs: ['{color.foo}'],
              },
              chain: ['{color.foo}', '{color.foo}'],
              type: 'circular',
            },
            {
              chain: ['{color.teal}', '{color.blue}', '{color.green}', '{color.teal}'],
              ref: '{color.teal}',
              token: {
                attributes: {},
                key: '{color.teal}',
                name: 'teal',
                original: {
                  value: '{color.blue}',
                },
                path: ['color', 'teal'],
                value: '{color.teal}',
                refs: ['{color.blue}', '{color.green}', '{color.teal}'],
              },
              type: 'circular',
            },
          ]);
          await expect(cleanConsoleOutput(error.message)).to.matchSnapshot();
        });
      });
    });
  });
});
