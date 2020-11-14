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

var helpers   = require('./__helpers');
var buildFile = require('../lib/buildFile');
var cleanFile = require('../lib/cleanFile');

function format() {
  return "hi";
}

describe('cleanFile', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should delete a file properly', () => {
    buildFile({destination:'test.txt', format}, {buildPath: '__tests__/__output/'}, {});
    cleanFile({destination:'test.txt', format}, {buildPath: '__tests__/__output/'}, {});
    expect(helpers.fileDoesNotExist('./__tests__/__output/test.txt')).toBeTruthy();
  });

  describe('if a file does not exist', () => {
    it('should not throw', () => {
      expect(() => cleanFile({destination: 'non-existent.txt', format}, { buildPath: '__tests__/__output/' }, {})).not.toThrow();
    })
  })

});
