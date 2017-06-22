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
    buildFiles = require('../lib/buildFiles'),
    cleanFiles = require('../lib/cleanFiles'),
    cleanDirs  = require('../lib/cleanDirs');

var dictionary = {
  properties: {
    foo: 'bar'
  }
};

var platform = {
  files: [
    {
      destination: 'test/output/extradir1/extradir2/extradir1/extradir2/test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

var platformWithBuildPath = {
  buildPath: 'test/output/extradir1/extradir2/',
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
  buildPath: 'test/output/extradir1/extradir2/',
  files: [
    {
      destination: 'test.json',
    }
  ]
};

var platformWithBadBuildPath = {
  buildPath: 'test/output/extradir1/extradir2',
  files: [
    {
      destination: 'test.json',
      format: function(dictionary) {
        return JSON.stringify(dictionary.properties)
      }
    }
  ]
};

describe('cleanDirs', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should delete without buildPath', function() {
    buildFiles( dictionary, platform );
    cleanFiles( dictionary, platform );
    cleanDirs( dictionary, platform );
    assert(helpers.dirDoesNotExist('./test/output/extradir1/extradir2'));
    assert(helpers.dirDoesNotExist('./test/output/extradir1'));
  });

  it('should delete with buildPath', function() {
    buildFiles( dictionary, platformWithBuildPath );
    cleanFiles( dictionary, platformWithBuildPath );
    cleanDirs( dictionary, platformWithBuildPath );
    assert(helpers.dirDoesNotExist('./test/output/extradir1/extradir2'));
    assert(helpers.dirDoesNotExist('./test/output/extradir1'));
  });
});
