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
var childProcess = require("child_process");
var helpers = require('./helpers');

describe('cliBuildWithJsConfig', () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  it('should work with json config', () => {
    childProcess.execSync("node ./bin/style-dictionary build --config ./__tests__/configs/test.json")
    assert(helpers.fileExists('./__tests__/output/web/_icons.css'), 'file [output/web/_icons.css] should exist');
    assert(helpers.fileExists('./__tests__/output/android/colors.xml'), 'file [output/android/colors.xml] should exist');
  });

  it('should work with javascript config', () => {
    childProcess.execSync("node ./bin/style-dictionary build --config ./__tests__/configs/test.js")
    assert(helpers.fileExists('./__tests__/output/web/_icons.css'), 'file [output/web/_icons.css] should exist');
    assert(helpers.fileExists('./__tests__/output/android/colors.xml'), 'file [output/android/colors.xml] should exist');
  });
});
