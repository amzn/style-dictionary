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

/**
 * @namespace Templates
 */
module.exports = {
  // Android templates

  /**
   * Creates a color resource xml file with all the colors in your style dictionary.
   *
   * @memberof Templates
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <color name="color_base_red_5">#fffaf3f2</color>
   *  <color name="color_base_red_30">#fff0cccc</color>
   *  <color name="color_base_red_60">#ffe19d9c</color>
   * ```
   */
  'android/colors': _.template(
    fs.readFileSync(__dirname + '/templates/android/colors.template')),

  /**
   * Creates a dimen resource xml file with all the sizes in your style dictionary.
   *
   * @memberof Templates
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <dimen name="size_padding_tiny">5.00dp</dimen>
   *  <dimen name="size_padding_small">10.00dp</dimen>
   *  <dimen name="size_padding_medium">15.00dp</dimen>
   * ```
   */
  'android/dimens': _.template(
    fs.readFileSync(__dirname + '/templates/android/dimens.template')),

  /**
   * Creates a dimen resource xml file with all the font sizes in your style dictionary.
   *
   * @memberof Templates
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *  <dimen name="size_font_tiny">10.00sp</dimen>
   *  <dimen name="size_font_small">13.00sp</dimen>
   *  <dimen name="size_font_medium">15.00sp</dimen>
   * ```
   */
  'android/fontDimens': _.template(
    fs.readFileSync(__dirname + '/templates/android/fontDimens.template')),

  /**
   * Creates a resource xml file with all the integers in your style dictionary. It filters your
   * style properties by `prop.attributes.category === 'time'`
   *
   * @memberof Templates
   * @todo Update the filter on this.
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *   <integer name="time_duration_short">1000</string>
   *   <integer name="time_duration_medium">2000</string>
   *   <integer name="time_duration_long">4000</string>
   * ```
   */
  'android/integers': _.template(
    fs.readFileSync(__dirname + '/templates/android/integers.template')),

  /**
   * Creates a resource xml file with all the strings in your style dictionary. Filters your
   * style properties by `prop.attributes.category === 'content'`
   *
   * @memberof Templates
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <resources>
   *   <string name="content_icon_email">&#xE001;</string>
   *   <string name="content_icon_chevron_down">&#xE002;</string>
   *   <string name="content_icon_chevron_up">&#xE003;</string>
   * ```
   */
  'android/strings': _.template(
    fs.readFileSync(__dirname + '/templates/android/strings.template')),

  // iOS templates

  /**
   * Creates an Objective-C header file with macros for style properties
   *
   * @memberof Templates
   * @example
   * ```objectivec
   * #import <Foundation/Foundation.h>
   * #import <UIKit/UIKit.h>
   *
   * #define ColorFontLink [UIColor colorWithRed:0.00f green:0.47f blue:0.80f alpha:1.00f]
   * #define SizeFontTiny 176.00f
   * ```
   */
  'ios/macros': _.template(
    fs.readFileSync(__dirname + '/templates/ios/macros.template')),

  /**
   * Creates an Objective-C plist file
   *
   * @memberof Templates
   * @todo Fix this template and add example and usage
   */
  'ios/plist': _.template(
    fs.readFileSync(__dirname + '/templates/ios/plist.template')),

  /**
   * Creates an Objective-C implementation file of a style dictionary singleton class
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/singleton.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/singleton.m.template')),

  /**
   * Creates an Objective-C header file of a style dictionary singleton class
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/singleton.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/singleton.h.template')),

  /**
   * Creates an Objective-C header file of a static style dictionary class
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/static.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/static.h.template')),

  /**
   * Creates an Objective-C implementation file of a static style dictionary class
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/static.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/static.m.template')),

  /**
   * Creates an Objective-C header file of a color class
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/colors.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/colors.h.template')),

  /**
   * Creates an Objective-C implementation file of a color class
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/colors.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/colors.m.template')),

  /**
   * Creates an Objective-C header file of strings
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/strings.h': _.template(
    fs.readFileSync(__dirname + '/templates/ios/strings.h.template')),

  /**
   * Creates an Objective-C implementation file of strings
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'ios/strings.m': _.template(
    fs.readFileSync(__dirname + '/templates/ios/strings.m.template')),

  // Css templates

  /**
   * Creates CSS file with @font-face declarations
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'css/fonts.css': _.template(
    fs.readFileSync(__dirname + '/templates/css/fonts.css.template')),

  // Web templates

  /**
   * Creates a generic static html page
   *
   * @memberof Templates
   * @todo Add example and usage
   */
  'static-style-guide/index.html': _.template(
    fs.readFileSync(__dirname + '/templates/static-style-guide/index.html.template'))
};
