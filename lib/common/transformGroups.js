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
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/kebab](/reference/hooks/transforms#namectikebab)
   * [size/px](/reference/hooks/transforms#sizepx)
   * [color/css](/reference/hooks/transforms#colorcss)
   *
   * @memberof TransformGroups
   */
  web: ['attribute/cti', 'name/kebab', 'size/px', 'color/css'],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/pascal](/reference/hooks/transforms#namectipascal)
   * [size/rem](/reference/hooks/transforms#sizerem)
   * [color/hex](/reference/hooks/transforms#colorhex)
   *
   * @memberof TransformGroups
   */
  js: ['attribute/cti', 'name/pascal', 'size/rem', 'color/hex'],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/kebab](/reference/hooks/transforms#namectikebab)
   * [time/seconds](/reference/hooks/transforms#timeseconds)
   * [html/icon](/reference/hooks/transforms#htmlicon)
   * [size/rem](/reference/hooks/transforms#sizerem)
   * [color/css](/reference/hooks/transforms#colorcss)
   * [asset/url](/reference/hooks/transforms#asset/url)
   *
   * @memberof TransformGroups
   */
  scss: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'html/icon',
    'size/rem',
    'color/css',
    'asset/url',
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/kebab](/reference/hooks/transforms#namectikebab)
   * [time/seconds](/reference/hooks/transforms#timeseconds)
   * [html/icon](/reference/hooks/transforms#htmlicon)
   * [size/rem](/reference/hooks/transforms#sizerem)
   * [color/css](/reference/hooks/transforms#colorcss)
   * [asset/url](/reference/hooks/transforms#asset/url)
   *
   * @memberof TransformGroups
   */
  css: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'html/icon',
    'size/rem',
    'color/css',
    'asset/url',
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/kebab](/reference/hooks/transforms#namectikebab)
   * [time/seconds](/reference/hooks/transforms#timeseconds)
   * [html/icon](/reference/hooks/transforms#htmlicon)
   * [size/rem](/reference/hooks/transforms#sizerem)
   * [color/hex](/reference/hooks/transforms#colorhex)
   * [asset/url](/reference/hooks/transforms#asset/url)
   *
   * @memberof TransformGroups
   */
  less: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'html/icon',
    'size/rem',
    'color/hex',
    'asset/url',
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [attribute/color](/reference/hooks/transforms#attributecolor)
   * [name/human](/reference/hooks/transforms#namehuman)
   *
   * @memberof TransformGroups
   */
  html: ['attribute/cti', 'attribute/color', 'name/human'],
  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/snake](/reference/hooks/transforms#namectisnake)
   * [color/hex8android](/reference/hooks/transforms#colorhex8android)
   * [size/remToSp](/reference/hooks/transforms#sizeremtosp)
   * [size/remToDp](/reference/hooks/transforms#sizeremtodp)
   *
   * @memberof TransformGroups
   */
  android: ['attribute/cti', 'name/snake', 'color/hex8android', 'size/remToSp', 'size/remToDp'],
  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/camel](/reference/hooks/transforms#namecamel)
   * [color/composeColor](/reference/hooks/transforms#colorcomposecolor)
   * [size/compose/em](/reference/hooks/transforms#sizecomposeem)
   * [size/compose/remToSp](/reference/hooks/transforms#sizecomposeremtosp)
   * [size/compose/remToDp](/reference/hooks/transforms#sizecomposeremtodp)
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
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/pascal](/reference/hooks/transforms#namectipascal)
   * [color/UIColor](/reference/hooks/transforms#coloruicolor)
   * [content/objC/literal](/reference/hooks/transforms#contentobjcliteral)
   * [asset/objC/literal](/reference/hooks/transforms#assetobjcliteral)
   * [size/remToPt](/reference/hooks/transforms#sizeremtopt)
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
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/camel](/reference/hooks/transforms#namecamel)
   * [color/UIColorSwift](/reference/hooks/transforms#coloruicolorswift)
   * [content/swift/literal](/reference/hooks/transforms#contentswiftliteral)
   * [asset/swift/literal](/reference/hooks/transforms#assetswiftliteral)
   * [size/swift/remToCGFloat](/reference/hooks/transforms#sizeswiftremtocgfloat)
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
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/camel](/reference/hooks/transforms#namecamel)
   * [color/UIColorSwift](/reference/hooks/transforms#coloruicolorswift)
   * [content/swift/literal](/reference/hooks/transforms#contentswiftliteral)
   * [asset/swift/literal](/reference/hooks/transforms#assetswiftliteral)
   * [size/swift/remToCGFloat](/reference/hooks/transforms#sizeswiftremtocgfloat)
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
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   *
   * @memberof TransformGroups
   */
  assets: ['attribute/cti'],
  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/camel](/reference/hooks/transforms#nameccamel)
   * [color/hex8flutter](/reference/hooks/transforms#colorhex8flutter)
   * [size/flutter/remToDouble](/reference/hooks/transforms#sizeflutterremToDouble)
   * [content/flutter/literal](/reference/hooks/transforms#contentflutterliteral)
   * [asset/flutter/literal](/reference/hooks/transforms#assetflutterliteral)
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
   * [attribute/cti](/reference/hooks/transforms#attributecti)
   * [name/camel](/reference/hooks/transforms#namecamel)
   * [color/hex8flutter](/reference/hooks/transforms#colorhex8flutter)
   * [size/flutter/remToDouble](/reference/hooks/transforms#sizeflutterremToDouble)
   * [content/flutter/literal](/reference/hooks/transforms#contentflutterliteral)
   * [asset/flutter/literal](/reference/hooks/transforms#assetflutterliteral)
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
   * [name/camel](/reference/hooks/transforms#namecamel)
   * [size/object](/reference/hooks/transforms#sizeobject)
   * [color/css](/reference/hooks/transforms#colorcss)
   *
   * @memberof TransformGroups
   */
  'react-native': ['name/camel', 'color/css', 'size/object'],
};
