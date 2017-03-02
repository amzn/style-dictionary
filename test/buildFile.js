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

var assert  = require('chai').assert,
  helpers   = require('./helpers'),
  buildFile = require('../lib/buildFile');

function format() {
  return "hi";
}

describe('buildFile', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should error if format doesnt exist or isnt a function', function() {
    assert.throws(function() {
      buildFile('test/output/test.txt', {}, {}, {})
    });
    assert.throws(function() {
      buildFile('test/output/test.txt', [], {}, {})
    });
    assert.throws(function() {
      buildFile('test/output/test.txt', null, {}, {})
    });
  });

  it('should error if destination doesnt exist or isnt a string', function() {
    assert.throws(function() {
      buildFile({}, format, {}, {})
    });
    assert.throws(function() {
      buildFile([], format, {}, {})
    });
    assert.throws(function() {
      buildFile(null, format, {}, {})
    });
  });

  it('should write to a file properly', function() {
    buildFile('test.txt', format, {buildPath: 'test/output/'}, {});
    assert(helpers.fileExists('./test/output/test.txt'));
  });
});
