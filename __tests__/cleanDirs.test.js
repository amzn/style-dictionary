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
import { clearOutput, dirExists } from './__helpers.js';
import buildFiles from '../lib/buildFiles.js';
import cleanFiles from '../lib/cleanFiles.js';
import cleanDirs from '../lib/cleanDirs.js';

const dictionary = {
  tokens: {
    foo: 'bar',
  },
};

const platform = {
  files: [
    {
      destination: '__tests__/__output/extradir1/extradir2/extradir1/extradir2/test.json',
      format: function (dictionary) {
        return JSON.stringify(dictionary.tokens);
      },
    },
  ],
};

const platformWithBuildPath = {
  buildPath: '__tests__/__output/extradir1/extradir2/',
  files: [
    {
      destination: 'test.json',
      format: function (dictionary) {
        return JSON.stringify(dictionary.tokens);
      },
    },
  ],
};

describe('cleanDirs', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it('should delete without buildPath', () => {
    buildFiles(dictionary, platform, {});
    cleanFiles(platform);
    cleanDirs(platform);
    expect(dirExists('__tests__/__output/extradir1/extradir2')).to.be.false;
    expect(dirExists('__tests__/__output/extradir1')).to.be.false;
  });

  it('should delete with buildPath', () => {
    buildFiles(dictionary, platformWithBuildPath, {});
    cleanFiles(platformWithBuildPath);
    cleanDirs(platformWithBuildPath);
    expect(dirExists('__tests__/__output/extradir1/extradir2')).to.be.false;
    expect(dirExists('__tests__/t__/__output/extradir1')).to.be.false;
  });

  it('should throw if buildPath does not end in a trailing slash', () => {
    expect(function () {
      cleanDirs({
        buildPath: 'foo',
      });
    }).to.throw('Build path must end in a trailing slash or you will get weird file names.');
  });
});
