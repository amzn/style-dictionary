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

var fs = require('fs'),
    _  = require('lodash');

module.exports = {
  // Android templates
  'android/colors': _.template(
    fs.readFileSync(__dirname + '/templates/android/colors.template')),
  'android/dimens': _.template(
    fs.readFileSync(__dirname + '/templates/android/dimens.template')),
  'android/fontDimens': _.template(
    fs.readFileSync(__dirname + '/templates/android/fontDimens.template')),
  'android/integers': _.template(
    fs.readFileSync(__dirname + '/templates/android/integers.template')),
  'android/strings': _.template(
    fs.readFileSync(__dirname + '/templates/android/strings.template')),

  // iOS templates
  'ios/macros': _.template(
    fs.readFileSync(__dirname + '/templates/ios/macros.template')),
  'ios/plist': _.template(
    fs.readFileSync(__dirname + '/templates/ios/plist.template')),
  'ios/singleton.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/singleton.m.template')),
  'ios/singleton.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/singleton.h.template')),
  'ios/static.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/static.h.template')),
  'ios/static.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/static.m.template')),
  'ios/colors.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/colors.h.template')),
  'ios/colors.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/colors.m.template')),
  'ios/strings.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/strings.h.template')),
  'ios/strings.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/strings.m.template')),

  // Web templates
  'static-style-guide/index.html': _.template(
    fs.readFileSync(__dirname + '/templates/static-style-guide/index.html.template'))
};
