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
import cleanFiles from '../dist/esm/cleanFiles.mjs';
import cleanDirs from '../dist/esm/cleanDirs.mjs';
import StyleDictionary from 'style-dictionary';

const dictionary = {
  tokens: {
    foo: 'bar',
  },
};

const platform = {
  files: [
    {
      destination: '__tests__/__output/extradir1/extradir2/extradir1/extradir2/test.json',
      format: 'foo',
    },
  ],
};

const platformWithBuildPath = {
  buildPath: '__tests__/__output/extradir1/extradir2/',
  files: [
    {
      destination: 'test.json',
      format: 'foo',
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

  it('should delete without buildPath', async () => {
    const sd = new StyleDictionary({
      hooks: {
        formats: {
          foo: (dictionary) => JSON.stringify(dictionary.tokens),
        },
      },
      tokens: dictionary.tokens,
      platforms: {
        bar: platform,
      },
    });
    await sd.buildAllPlatforms();
    await cleanFiles(platform);
    await cleanDirs(platform);
    expect(dirExists('__tests__/__output/extradir1/extradir2')).to.be.false;
    expect(dirExists('__tests__/__output/extradir1')).to.be.false;
  });

  it('should delete with buildPath', async () => {
    const sd = new StyleDictionary({
      hooks: {
        formats: {
          foo: (dictionary) => JSON.stringify(dictionary.tokens),
        },
      },
      tokens: dictionary.tokens,
      platforms: {
        bar: platformWithBuildPath,
      },
    });
    await sd.buildAllPlatforms();
    await cleanFiles(platformWithBuildPath);
    await cleanDirs(platformWithBuildPath);
    expect(dirExists('__tests__/__output/extradir1/extradir2')).to.be.false;
    expect(dirExists('__tests__/t__/__output/extradir1')).to.be.false;
  });

  it('should throw if buildPath does not end in a trailing slash', async () => {
    await expect(cleanDirs({ buildPath: 'foo' })).to.eventually.rejectedWith(
      'Build path must end in a trailing slash or you will get weird file names.',
    );
  });
});
