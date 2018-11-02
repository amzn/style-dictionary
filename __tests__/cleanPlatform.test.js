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

var helpers = require('./__helpers');
var config = helpers.fileToJSON(__dirname + '/__configs/test.json');
var StyleDictionary = require('../index');
var StyleDictionaryExtended = StyleDictionary.extend(config);

describe('cleanPlatform', () => {

  beforeEach(() => {
    helpers.clearOutput();
  });

  afterEach(() => {
    helpers.clearOutput();
  });

  it('should delete the proper files', () => {
    StyleDictionaryExtended.buildPlatform('web');
    StyleDictionaryExtended.cleanPlatform('web');
    expect(helpers.fileDoesNotExist('./__tests__/__output/web/_icons.scss')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/web/_styles.js')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/web/_variables.scss')).toBeTruthy();
  });

  it('should delete android stuff', () => {
    StyleDictionaryExtended.buildPlatform('android');
    StyleDictionaryExtended.cleanPlatform('android');
    expect(helpers.fileDoesNotExist('./__tests__/__output/android/main/res/drawable-hdpi/flag_us.png')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/android/main/res/drawable-xhdpi/flag_us.png')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/android/colors.xml')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/android/dimens.xml')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/android/font_dimen.xml')).toBeTruthy();
  });

  it('should delete ios stuff', () => {
    StyleDictionaryExtended.buildPlatform('ios');
    StyleDictionaryExtended.cleanPlatform('ios');
    expect(helpers.fileDoesNotExist('./__tests__/__output/ios/style_dictionary.plist')).toBeTruthy();
    expect(helpers.fileDoesNotExist('./__tests__/__output/ios/style_dictionary.h')).toBeTruthy();
  });

});
