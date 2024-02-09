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
import { clearOutput, fileExists } from './__helpers.js';
import buildFiles from '../lib/buildFiles.js';
import cleanFiles from '../lib/cleanFiles.js';

const dictionary = {
  tokens: {
    foo: 'bar',
  },
};

const platform = {
  files: [
    {
      destination: '__tests__/__output/test.json',
      format: function (dictionary) {
        return JSON.stringify(dictionary.tokens);
      },
    },
  ],
};

const platformWithBuildPath = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      format: function (dictionary) {
        return JSON.stringify(dictionary.tokens);
      },
    },
  ],
};

describe('cleanFiles', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should delete without buildPath', () => {
    buildFiles(dictionary, platform, {});
    cleanFiles(platform);
    expect(fileExists('__tests__/__output/test.json')).to.be.false;
  });

  it('should delete with buildPath', () => {
    buildFiles(dictionary, platformWithBuildPath, {});
    cleanFiles(platformWithBuildPath);
    expect(fileExists('__tests__/t__/__output/test.json')).to.be.false;
  });
});
