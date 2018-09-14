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

var assert = require('chai').assert;
var expect = require('chai').expect;
var helpers = require('./helpers');
var buildFiles = require('../lib/buildFiles');

var dictionary = {
  properties: {
    foo: { value: 'bar' },
    bingo: { value: 'bango' }
  }
};

var platform = {
  files: [
    {
      destination: '__tests__/output/test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithBuildPath = {
  buildPath: '__tests__/output/',
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
  buildPath: '__tests__/output/',
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
  buildPath: '__tests__/output/',
  files: [
    {
      destination: 'test.json',
    }
  ]
};

var platformWithBadBuildPath = {
  buildPath: '__tests__/output',
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

  it('should throw if build path doesn\'t have a trailing slash', () => {
    assert.throws(
      buildFiles.bind(null, dictionary, platformWithBadBuildPath),
      Error,
      'Build path must end in a trailing slash or you will get weird file names.'
    );
  });

  it('should throw if template or formatter missing', () => {
    assert.throws(
      buildFiles.bind(null, dictionary, platformWithoutFormatter),
      Error,
      'Please supply a template or formatter'
    );
  });

  it('should work without buildPath', () => {
    buildFiles( dictionary, platform );
    assert(helpers.fileExists('./__tests__/output/test.json'), "file [output/test.json] should exist");
  });

  it('should work with buildPath', () => {
    buildFiles( dictionary, platformWithBuildPath );
    assert(helpers.fileExists('./__tests__/output/test.json'), "file [output/test.json] should exist");
  });

  it('should work with a filter', () => {
    buildFiles( dictionary, platformWithFilter );
    assert(helpers.fileExists('./__tests__/output/test.json'), "file [output/test.json] should exist");
    var output = require("./output/test.json")
    expect(output).to.not.have.any.keys("foo")
    expect(output).to.have.all.keys("bingo")
  });
});
