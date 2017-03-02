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
    helpers         = require('./helpers'),
    StyleDictionary = require('../index');

// Test configs
var config = helpers.fileToJSON(__dirname + '/configs/test.json');
var test = StyleDictionary.extend(config);

describe('buildAllPlatforms', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should work', function() {
    test.buildAllPlatforms();
    assert(helpers.fileExists('./test/output/web/_icons.scss'));
    assert(helpers.fileExists('./test/output/android/colors.xml'));
  });
});
