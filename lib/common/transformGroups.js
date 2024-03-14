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

/**
 * @namespace TransformGroups
 */

/**
 * @type {Record<string, string[]>}
 */
export default {
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/kebab](transforms.md#namectikebab)
   * [size/px](transforms.md#sizepx)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  web: ['attribute/cti', 'name/kebab', 'size/px', 'color/css'],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/pascal](transforms.md#namectipascal)
   * [size/rem](transforms.md#sizerem)
   * [color/hex](transforms.md#colorhex)
   *
   * @memberof TransformGroups
   */
  js: ['attribute/cti', 'name/pascal', 'size/rem', 'color/hex'],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/kebab](transforms.md#namectikebab)
   * [time/seconds](transforms.md#timeseconds)
   * [html/icon](transforms.md#htmlicon)
   * [size/rem](transforms.md#sizerem)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  scss: ['attribute/cti', 'name/kebab', 'time/seconds', 'html/icon', 'size/rem', 'color/css'],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/kebab](transforms.md#namectikebab)
   * [time/seconds](transforms.md#timeseconds)
   * [html/icon](transforms.md#htmlicon)
   * [size/rem](transforms.md#sizerem)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  css: ['attribute/cti', 'name/kebab', 'time/seconds', 'html/icon', 'size/rem', 'color/css'],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/kebab](transforms.md#namectikebab)
   * [time/seconds](transforms.md#timeseconds)
   * [html/icon](transforms.md#htmlicon)
   * [size/rem](transforms.md#sizerem)
   * [color/hex](transforms.md#colorhex)
   *
   * @memberof TransformGroups
   */
  less: ['attribute/cti', 'name/kebab', 'time/seconds', 'html/icon', 'size/rem', 'color/hex'],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [attribute/color](transforms.md#attributecolor)
   * [name/human](transforms.md#namehuman)
   *
   * @memberof TransformGroups
   */
  html: ['attribute/cti', 'attribute/color', 'name/human'],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/snake](transforms.md#namectisnake)
   * [color/hex8android](transforms.md#colorhex8android)
   * [size/remToSp](transforms.md#sizeremtosp)
   * [size/remToDp](transforms.md#sizeremtodp)
   *
   * @memberof TransformGroups
   */
  android: ['attribute/cti', 'name/snake', 'color/hex8android', 'size/remToSp', 'size/remToDp'],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/camel](transforms.md#namecamel)
   * [color/composeColor](transforms.md#colorcomposecolor)
   * [size/compose/em](transforms.md#sizecomposeem)
   * [size/compose/remToSp](transforms.md#sizecomposeremtosp)
   * [size/compose/remToDp](transforms.md#sizecomposeremtodp)
   *
   * @memberof TransformGroups
   */
  compose: [
    'attribute/cti',
    'name/camel',
    'color/composeColor',
    'size/compose/em',
    'size/compose/remToSp',
    'size/compose/remToDp',
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/pascal](transforms.md#namectipascal)
   * [color/UIColor](transforms.md#coloruicolor)
   * [content/objC/literal](transforms.md#contentobjcliteral)
   * [asset/objC/literal](transforms.md#assetobjcliteral)
   * [size/remToPt](transforms.md#sizeremtopt)
   *
   * @memberof TransformGroups
   */
  ios: [
    'attribute/cti',
    'name/pascal',
    'color/UIColor',
    'content/objC/literal',
    'asset/objC/literal',
    'size/remToPt',
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/camel](transforms.md#namecamel)
   * [color/UIColorSwift](transforms.md#coloruicolorswift)
   * [content/swift/literal](transforms.md#contentswiftliteral)
   * [asset/swift/literal](transforms.md#assetswiftliteral)
   * [size/swift/remToCGFloat](transforms.md#sizeswiftremtocgfloat)
   *
   * @memberof TransformGroups
   */
  'ios-swift': [
    'attribute/cti',
    'name/camel',
    'color/UIColorSwift',
    'content/swift/literal',
    'asset/swift/literal',
    'size/swift/remToCGFloat',
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/camel](transforms.md#namecamel)
   * [color/UIColorSwift](transforms.md#coloruicolorswift)
   * [content/swift/literal](transforms.md#contentswiftliteral)
   * [asset/swift/literal](transforms.md#assetswiftliteral)
   * [size/swift/remToCGFloat](transforms.md#sizeswiftremtocgfloat)
   *
   * This is to be used if you want to have separate files per category and you don't want the category (e.g., color) as the lead value in the name of the token (e.g., StyleDictionaryColor.baseText instead of StyleDictionary.colorBaseText).
   *
   * @memberof TransformGroups
   */
  'ios-swift-separate': [
    'attribute/cti',
    'name/camel',
    'color/UIColorSwift',
    'content/swift/literal',
    'asset/swift/literal',
    'size/swift/remToCGFloat',
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   *
   * @memberof TransformGroups
   */
  assets: ['attribute/cti'],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/camel](transforms.md#nameccamel)
   * [color/hex8flutter](transforms.md#colorhex8flutter)
   * [size/flutter/remToDouble](transforms.md#sizeflutterremToDouble)
   * [content/flutter/literal](transforms.md#contentflutterliteral)
   * [asset/flutter/literal](transforms.md#assetflutterliteral)
   *
   * @memberof TransformGroups
   */
  flutter: [
    'attribute/cti',
    'name/camel',
    'color/hex8flutter',
    'size/flutter/remToDouble',
    'content/flutter/literal',
    'asset/flutter/literal',
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/camel](transforms.md#namecamel)
   * [color/hex8flutter](transforms.md#colorhex8flutter)
   * [size/flutter/remToDouble](transforms.md#sizeflutterremToDouble)
   * [content/flutter/literal](transforms.md#contentflutterliteral)
   * [asset/flutter/literal](transforms.md#assetflutterliteral)
   *
   * This is to be used if you want to have separate files per category and you don't want the category (e.g., color) as the lead value in the name of the token (e.g., StyleDictionaryColor.baseText instead of StyleDictionary.colorBaseText).
   *
   * @memberof TransformGroups
   */
  'flutter-separate': [
    'attribute/cti',
    'name/camel',
    'color/hex8flutter',
    'size/flutter/remToDouble',
    'content/flutter/literal',
    'asset/flutter/literal',
  ],

  /**
   * Transforms:
   *
   * [name/camel](transforms.md#namecamel)
   * [size/object](transforms.md#sizeobject)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  'react-native': ['name/camel', 'color/css', 'size/object'],
};
