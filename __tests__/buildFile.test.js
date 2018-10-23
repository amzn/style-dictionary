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

const buildFile = require('../lib/buildFile');
const helpers   = require('./__helpers');

function format() {
  return "hi";
}

describe('buildFile', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should error if format doesnt exist or isnt a function', () => {
    expect(
      buildFile.bind(null, '__tests__/__output/test.txt', {}, {}, {})
    ).toThrow('Please enter a valid file format');
    expect(
      buildFile.bind(null, '__tests__/__output/test.txt', [], {}, {})
    ).toThrow('Please enter a valid file format');
    expect(
      buildFile.bind(null, '__tests__/__output/test.txt', null, {}, {})
    ).toThrow('Please enter a valid file format');
  });

  it('should error if destination doesnt exist or isnt a string', () => {
    expect(
      buildFile.bind(null, {}, format, {}, {})
    ).toThrow('Please enter a valid destination');
    expect(
      buildFile.bind(null, [], format, {}, {})
    ).toThrow('Please enter a valid destination');
    expect(
      buildFile.bind(null, null, format, {}, {})
    ).toThrow('Please enter a valid destination');
  });

  it('should write to a file properly', () => {
    buildFile('test.txt', format, {buildPath: '__tests__/__output/'}, {});
    expect(helpers.fileExists('./__tests__/__output/test.txt')).toBeTruthy();
  });
});
