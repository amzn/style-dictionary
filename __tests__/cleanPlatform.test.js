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
var helpers = require('./__helpers');
var config = helpers.fileToJSON(__dirname + '/__configs/test.json');
var StyleDictionary = require('../index').extend(config);

describe('cleanPlatform', () => {
  beforeEach(() => {
    helpers.clearOutput();
  });

  it('should delete the proper files', () => {
    StyleDictionary.buildPlatform('web');
    StyleDictionary.cleanPlatform('web');
    assert(helpers.fileDoesNotExist('./__tests__/output/web/_icons.scss'));
    assert(helpers.fileDoesNotExist('./__tests__/output/web/_styles.js'));
    assert(helpers.fileDoesNotExist('./__tests__/output/web/_variables.scss'));
  });

  it('should delete android stuff', () => {
    StyleDictionary.buildPlatform('android');
    StyleDictionary.cleanPlatform('android');
    assert(helpers.fileDoesNotExist('./__tests__/output/android/main/res/drawable-hdpi/flag_us.png'));
    assert(helpers.fileDoesNotExist('./__tests__/output/android/main/res/drawable-xhdpi/flag_us.png'));
    assert(helpers.fileDoesNotExist('./__tests__/output/android/colors.xml'));
    assert(helpers.fileDoesNotExist('./__tests__/output/android/dimens.xml'));
    assert(helpers.fileDoesNotExist('./__tests__/output/android/font_dimen.xml'));
  });

  it('should delete ios stuff', () => {
    StyleDictionary.buildPlatform('ios');
    StyleDictionary.cleanPlatform('ios');
    assert(helpers.fileDoesNotExist('./__tests__/output/ios/style_dictionary.plist'));
    assert(helpers.fileDoesNotExist('./__tests__/output/ios/style_dictionary.h'));
  });
});
