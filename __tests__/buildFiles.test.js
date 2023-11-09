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
import { fs } from 'style-dictionary/fs';
import buildFiles from '../lib/buildFiles.js';
import { clearOutput, fileExists } from './__helpers.js';

const dictionary = {
  tokens: {
    foo: { value: 'bar' },
    bingo: { value: 'bango' },
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

const platformWithFilter = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      filter: function (property) {
        return property.value === 'bango';
      },
      format: function (dictionary) {
        return JSON.stringify(dictionary.tokens);
      },
    },
  ],
};

const platformWithoutFormatter = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
    },
  ],
};

const platformWithBadBuildPath = {
  buildPath: '__tests__/__output',
  files: [
    {
      destination: 'test.json',
      format: function (dictionary) {
        return JSON.stringify(dictionary.tokens);
      },
    },
  ],
};

describe('buildFiles', () => {
  beforeEach(() => {
    clearOutput();
  });

  afterEach(() => {
    clearOutput();
  });

  it("should throw if build path doesn't have a trailing slash", () => {
    expect(buildFiles.bind(null, dictionary, platformWithBadBuildPath)).to.throw(
      'Build path must end in a trailing slash or you will get weird file names.',
    );
  });

  it('should throw if missing a format', () => {
    expect(buildFiles.bind(null, dictionary, platformWithoutFormatter)).to.throw(
      'Please supply a format',
    );
  });

  it('should work without buildPath', () => {
    buildFiles(dictionary, platform);
    expect(fileExists('__tests__/__output/test.json')).to.be.true;
  });

  it('should work with buildPath', () => {
    buildFiles(dictionary, platformWithBuildPath);
    expect(fileExists('__tests__/__output/test.json')).to.be.true;
  });

  it('should work with a filter', () => {
    buildFiles(dictionary, platformWithFilter);
    expect(fileExists('__tests__/__output/test.json')).to.be.true;
    const output = JSON.parse(fs.readFileSync('__tests__/__output/test.json'));
    expect(output).to.have.property('bingo');
    expect(output).to.not.have.property('foo');
    Object.values(output).forEach((property) => {
      expect(property.value).to.equal('bango');
    });
  });
});
