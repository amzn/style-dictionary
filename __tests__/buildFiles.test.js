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

const _ = require('lodash');
const buildFiles = require('../lib/buildFiles');
const helpers = require('./__helpers');

const dictionary = {
  properties: {
    foo: { value: 'bar' },
    bingo: { value: 'bango' },
  },
};

const platform = {
  files: [
    {
      destination: '__tests__/__output/test.json',
      format({ properties }) {
        return JSON.stringify(properties);
      },
    },
  ],
};

const platformWithBuildPath = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      format({ properties }) {
        return JSON.stringify(properties);
      },
    },
  ],
};

const platformWithFilter = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      filter({ value }) {
        return value === 'bango';
      },
      format({ properties }) {
        return JSON.stringify(properties);
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
      format({ properties }) {
        return JSON.stringify(properties);
      },
    },
  ],
};

describe('buildFiles', () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it("should throw if build path doesn't have a trailing slash", () => {
    expect(buildFiles.bind(null, dictionary, platformWithBadBuildPath)).toThrow(
      'Build path must end in a trailing slash or you will get weird file names.'
    );
  });

  it('should throw if template or formatter missing', () => {
    expect(buildFiles.bind(null, dictionary, platformWithoutFormatter)).toThrow(
      'Please supply a template or formatter'
    );
  });

  it('should work without buildPath', () => {
    buildFiles(dictionary, platform);
    expect(helpers.fileExists('./__tests__/__output/test.json')).toBeTruthy();
  });

  it('should work with buildPath', () => {
    buildFiles(dictionary, platformWithBuildPath);
    expect(helpers.fileExists('./__tests__/__output/test.json')).toBeTruthy();
  });

  it('should work with a filter', () => {
    buildFiles(dictionary, platformWithFilter);
    expect(helpers.fileExists('./__tests__/__output/test.json')).toBeTruthy();
    const output = require('./__output/test.json');
    expect(output).toHaveProperty('bingo');
    expect(output).not.toHaveProperty('foo');
    _.each(output, ({ value }) => {
      expect(value).toBe('bango');
    });
  });
});
