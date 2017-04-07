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

var assert          = require('chai').assert,
    convertToBase64 = require('../../lib/utils/convertToBase64.js');

describe('base64', function() {
  it('should error if filePath isnt a string', function() {
    assert.throws(
      convertToBase64.bind(null),
      Error,
      'filePath name must be a string'
    );
    assert.throws(
      convertToBase64.bind(null, []),
      Error,
      'filePath name must be a string'
    );
    assert.throws(
      convertToBase64.bind(null, {}),
      Error,
      'filePath name must be a string'
    );
  });

  it('should error if filePath isnt a file', function() {
    assert.throws(
      convertToBase64.bind(null, 'foo'),
      Error,
      "ENOENT: no such file or directory, open \'foo\'"
    );
  });

  it('should return a string', function() {
    assert.isString(convertToBase64('test/configs/test.json'));
  });
});
