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

describe('cleanPlatform', function() {
  beforeEach(function() {
    helpers.clearOutput();
  });

  it('should delete the proper files', function() {
    test.buildPlatform('web');
    test.cleanPlatform('web');
    assert(helpers.fileDoesNotExist('./test/output/web/_icons.scss'));
    assert(helpers.fileDoesNotExist('./test/output/web/_styles.js'));
    assert(helpers.fileDoesNotExist('./test/output/web/_variables.scss'));
  });

  it('should delete android stuff', function() {
    test.buildPlatform('android');
    test.cleanPlatform('android');
    assert(helpers.fileDoesNotExist('./test/output/android/main/res/drawable-hdpi/flag_us.png'));
    assert(helpers.fileDoesNotExist('./test/output/android/main/res/drawable-xhdpi/flag_us.png'));
    assert(helpers.fileDoesNotExist('./test/output/android/colors.xml'));
    assert(helpers.fileDoesNotExist('./test/output/android/dimens.xml'));
    assert(helpers.fileDoesNotExist('./test/output/android/font_dimen.xml'));
  });

  it('should delete ios stuff', function() {
    test.buildPlatform('ios');
    test.cleanPlatform('ios');
    assert(helpers.fileDoesNotExist('./test/output/ios/style_dictionary.plist'));
    assert(helpers.fileDoesNotExist('./test/output/ios/style_dictionary.h'));
  });
});
