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

var assert     = require('chai').assert,
    helpers    = require('./helpers'),
    buildFiles = require('../lib/buildFiles');

var dictionary = {
  properties: {
    foo: 'bar'
  }
};

var platform = {
  files: [
    {
      destination: 'test/output/test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithBuildPath = {
  buildPath: 'test/output/',
  files: [
    {
      destination: 'test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithoutFormatter = {
  buildPath: 'test/output/',
  files: [
    {
      destination: 'test.json',
    }
  ]
};

var platformWithBadBuildPath = {
  buildPath: 'test/output',
  files: [
    {
      destination: 'test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

describe('buildFiles', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should throw if build path doesn\'t have a trailing slash', function() {
    assert.throws(
      buildFiles.bind(null, dictionary, platformWithBadBuildPath),
      Error,
      'Build path must end in a trailing slash or you will get weird file names.'
    );
  });

  it('should throw if template or formatter missing', function() {
    assert.throws(
      buildFiles.bind(null, dictionary, platformWithoutFormatter),
      Error,
      'Please supply a template or formatter'
    );
  });

  it('should work without buildPath', function() {
    buildFiles( dictionary, platform );
    assert(helpers.fileExists('./test/output/test.json'));
  });

  it('should work with buildPath', function() {
    buildFiles( dictionary, platformWithBuildPath );
    assert(helpers.fileExists('./test/output/test.json'));
  });
});
