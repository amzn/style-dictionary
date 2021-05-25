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

var buildFiles = require('../lib/buildFiles');
var helpers = require('./__helpers');
var _ = require('../lib/utils/es6_');

var dictionary = {
  properties: {
    foo: { value: 'bar' },
    bingo: { value: 'bango' }
  }
};

var platform = {
  files: [
    {
      destination: '__tests__/__output/test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithBuildPath = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithFilter = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
      filter: function(property) {
        return property.value === "bango"
      },
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      },
    }
  ]
};

var platformWithoutFormatter = {
  buildPath: '__tests__/__output/',
  files: [
    {
      destination: 'test.json',
    }
  ]
};

var platformWithBadBuildPath = {
  buildPath: '__tests__/__output',
  files: [
    {
      destination: 'test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

describe('buildFiles', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should throw if build path doesn\'t have a trailing slash', () => {
    expect(
      buildFiles.bind(null, dictionary, platformWithBadBuildPath)
    ).toThrow('Build path must end in a trailing slash or you will get weird file names.');
  });

  it('should throw if missing a format', () => {
    expect(
      buildFiles.bind(null, dictionary, platformWithoutFormatter)
    ).toThrow('Please supply a format');
  });

  it('should work without buildPath', () => {
    buildFiles( dictionary, platform );
    expect(helpers.fileExists('./__tests__/__output/test.json')).toBeTruthy();
  });

  it('should work with buildPath', () => {
    buildFiles( dictionary, platformWithBuildPath );
    expect(helpers.fileExists('./__tests__/__output/test.json')).toBeTruthy();
  });

  it('should work with a filter', () => {
    buildFiles(dictionary, platformWithFilter);
    expect(helpers.fileExists('./__tests__/__output/test.json')).toBeTruthy();
    var output = require("./__output/test.json")
    expect(output).toHaveProperty('bingo');
    expect(output).not.toHaveProperty('foo');
    _.each(output, function(property) {
      expect(property.value).toBe('bango');
    });
  });

});
