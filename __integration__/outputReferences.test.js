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
const StyleDictionary = require('../index');
const {buildPath} = require('./_constants');

describe('integration', () => {
  describe('output references', () => {
    it('should warn the user if filters out references', () => {
      console.log = jest.fn();
      StyleDictionary.extend({
        // we are only testing showFileHeader options so we don't need
        // the full source.
        source: [`__integration__/tokens/**/*.json?(c)`],
        platforms: {
          css: {
            transformGroup: 'css',
            buildPath,
            files: [{
              destination: 'filteredVariables.css',
              format: 'css/variables',
              // filter tokens and use outputReferences
              // Style Dictionary should build this file ok
              // but warn the user
              filter: (token) => token.attributes.type === 'background',
              options: {
                outputReferences: true
              }
            }]
          }
        }
      }).buildAllPlatforms();

      expect(console.log).toHaveBeenCalledWith(`⚠️ ${buildPath}filteredVariables.css`);
    });
  });
});

afterAll(() => {
  fs.emptyDirSync(buildPath);
});