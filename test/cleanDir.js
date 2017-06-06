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
  buildFile = require('../lib/buildFile'),
  cleanFile = require('../lib/cleanFile'),
  cleanDir = require('../lib/cleanDir');

function format() {
  return "hi";
}

describe('cleanDir', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should delete a dir properly', function() {
    buildFile('test.txt', format, {buildPath: 'test/output/extradir1/extradir2/'}, {});
    cleanFile('test.txt', format, {buildPath: 'test/output/extradir1/extradir2/'}, {});
    cleanDir('test.txt', format, {buildPath: 'test/output/extradir1/extradir2/'}, {});
    assert(helpers.dirDoesNotExist('./test/output/extradir1/extradir2'));
    assert(helpers.dirDoesNotExist('./test/output/extradir1'));
  });
});
