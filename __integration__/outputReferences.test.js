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
import { fs } from 'style-dictionary/fs';
import { restore, stubMethod } from 'hanbi';
import { buildPath, cleanConsoleOutput } from './_constants.js';
import { resolve } from '../lib/resolve.js';
import { clearOutput } from '../__tests__/__helpers.js';
import { outputReferencesFilter } from '../lib/utils/references/outputReferencesFilter.js';
import { outputReferencesTransformed } from '../lib/utils/index.js';

describe('integration', async () => {
  let stub;
  beforeEach(() => {
    stub = stubMethod(console, 'log');
  });

  afterEach(() => {
    clearOutput(buildPath);
    restore();
  });

  describe('output references', async () => {
    it('should allow using outputReferencesTransformed to not output refs when value has been transitively transformed', async () => {
      restore();
      const sd = new StyleDictionary({
        tokens: {
          base: {
            value: 'rgb(0,0,0)',
            type: 'color',
          },
          referred: {
            value: 'rgba({base},0.12)',
            type: 'color',
          },
        },
        transform: {
          'rgb-in-rgba': {
            type: 'value',
            transitive: true,
            matcher: (token) => token.type === 'color',
            // quite naive transform to support rgb inside rgba
            transformer: (token) => {
              const reg = /rgba\((rgb\((\d,\d,\d)\)),((0\.)?\d+?)\)/g;
              const match = reg.exec(token.value);
              if (match && match[1] && match[2]) {
                return token.value.replace(match[1], match[2]);
              }
              return token.value;
            },
          },
        },
        platforms: {
          css: {
            transforms: ['rgb-in-rgba'],
            buildPath,
            files: [
              {
                destination: 'transformedFilteredVariables.css',
                format: 'css/variables',
                options: {
                  outputReferences: outputReferencesTransformed,
                },
              },
            ],
          },
        },
      });
      await sd.buildAllPlatforms();
      const output = fs.readFileSync(resolve(`${buildPath}transformedFilteredVariables.css`), {
        encoding: 'UTF-8',
      });
      await expect(output).to.matchSnapshot();
    });

    it('should warn the user if filters out references briefly', async () => {
      const sd = new StyleDictionary({
        // we are only testing showFileHeader options so we don't need
        // the full source.
        source: [`__integration__/tokens/**/[!_]*.json?(c)`],
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

    it('should not warn the user if filters out references is prevented with outputReferencesFilter', async () => {
      const sd = new StyleDictionary({
        // we are only testing showFileHeader options so we don't need
        // the full source.
        log: { verbosity: 'verbose' },
        source: [`__integration__/tokens/**/[!_]*.json?(c)`],
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
                  outputReferences: outputReferencesFilter,
                },
              },
            ],
          },
        },
      });
      await sd.buildAllPlatforms();
      await expect(
        [...stub.calls].map((cal) => cal.args.map(cleanConsoleOutput)).join('\n'),
      ).to.matchSnapshot();
    });

    it('should warn the user if filters out references with a detailed message when using verbose logging', async () => {
      const sd = new StyleDictionary({
        log: { verbosity: 'verbose' },
        // we are only testing showFileHeader options so we don't need
        // the full source.
        source: [`__integration__/tokens/**/[!_]*.json?(c)`],
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
