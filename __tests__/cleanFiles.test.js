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

const helpers = require('./__helpers');
const buildFiles = require('../lib/buildFiles');
const cleanFiles = require('../lib/cleanFiles');

const dictionary = {
  properties: {
    foo: 'bar',
  },
};

const platform = {
  files: [
    {
      destination: '__tests__/__output/test.json',
      format: ({ properties }) => JSON.stringify(properties),
    },
  ],
};

const platformWithBuildPath = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      format: ({ properties }) => JSON.stringify(properties),
    },
  ],
};

describe('cleanFiles', () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should delete without buildPath', () => {
    buildFiles(dictionary, platform);
    cleanFiles(dictionary, platform);
    expect(helpers.fileDoesNotExist('./__tests__/__output/test.json')).toBeTruthy();
  });

  it('should delete with buildPath', () => {
    buildFiles(dictionary, platformWithBuildPath);
    cleanFiles(dictionary, platformWithBuildPath);
    expect(helpers.fileDoesNotExist('./__tests__/__output/test.json')).toBeTruthy();
  });
});
