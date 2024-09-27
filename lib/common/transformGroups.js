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
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/kebab](/reference/hooks/transforms/predefined#namectikebab)
   * [size/px](/reference/hooks/transforms/predefined#sizepx)
   * [color/css](/reference/hooks/transforms/predefined#colorcss)
   *
   * @memberof TransformGroups
   */
  web: ['attribute/cti', 'name/kebab', 'size/px', 'color/css'],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/pascal](/reference/hooks/transforms/predefined#namectipascal)
   * [size/rem](/reference/hooks/transforms/predefined#sizerem)
   * [color/hex](/reference/hooks/transforms/predefined#colorhex)
   *
   * @memberof TransformGroups
   */
  js: ['attribute/cti', 'name/pascal', 'size/rem', 'color/hex'],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/kebab](/reference/hooks/transforms/predefined#namectikebab)
   * [time/seconds](/reference/hooks/transforms/predefined#timeseconds)
   * [html/icon](/reference/hooks/transforms/predefined#htmlicon)
   * [size/rem](/reference/hooks/transforms/predefined#sizerem)
   * [color/css](/reference/hooks/transforms/predefined#colorcss)
   * [asset/url](/reference/hooks/transforms/predefined#asset/url)
   * [fontFamily/css](/reference/hooks/transforms/predefined#fontfamilycss)
   * [cubicBezier/css](/reference/hooks/transforms/predefined#cubicbezier)
   * [strokeStyle/css/shorthand](/reference/hooks/transforms/predefined#strokestylecssshorthand)
   * [border/css/shorthand](/reference/hooks/transforms/predefined#bordercssshorthand)
   * [typography/css/shorthand](/reference/hooks/transforms/predefined#typographycssshorthand)
   * [transition/css/shorthand](/reference/hooks/transforms/predefined#transitioncssshorthand)
   * [shadow/css/shorthand](/reference/hooks/transforms/predefined#shadowcssshorthand)
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
    'fontFamily/css',
    'cubicBezier/css',
    // object-value tokens
    'strokeStyle/css/shorthand',
    'border/css/shorthand',
    'typography/css/shorthand',
    'transition/css/shorthand',
    'shadow/css/shorthand',
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/kebab](/reference/hooks/transforms/predefined#namectikebab)
   * [time/seconds](/reference/hooks/transforms/predefined#timeseconds)
   * [html/icon](/reference/hooks/transforms/predefined#htmlicon)
   * [size/rem](/reference/hooks/transforms/predefined#sizerem)
   * [color/css](/reference/hooks/transforms/predefined#colorcss)
   * [asset/url](/reference/hooks/transforms/predefined#asset/url)
   * [fontFamily/css](/reference/hooks/transforms/predefined#fontfamilycss)
   * [cubicBezier/css](/reference/hooks/transforms/predefined#cubicbezier)
   * [strokeStyle/css/shorthand](/reference/hooks/transforms/predefined#strokestylecssshorthand)
   * [border/css/shorthand](/reference/hooks/transforms/predefined#bordercssshorthand)
   * [typography/css/shorthand](/reference/hooks/transforms/predefined#typographycssshorthand)
   * [transition/css/shorthand](/reference/hooks/transforms/predefined#transitioncssshorthand)
   * [shadow/css/shorthand](/reference/hooks/transforms/predefined#shadowcssshorthand)
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
    'fontFamily/css',
    'cubicBezier/css',
    // object-value tokens
    'strokeStyle/css/shorthand',
    'border/css/shorthand',
    'typography/css/shorthand',
    'transition/css/shorthand',
    'shadow/css/shorthand',
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/kebab](/reference/hooks/transforms/predefined#namectikebab)
   * [time/seconds](/reference/hooks/transforms/predefined#timeseconds)
   * [html/icon](/reference/hooks/transforms/predefined#htmlicon)
   * [size/rem](/reference/hooks/transforms/predefined#sizerem)
   * [color/hex](/reference/hooks/transforms/predefined#colorhex)
   * [asset/url](/reference/hooks/transforms/predefined#asset/url)
   * [fontFamily/css](/reference/hooks/transforms/predefined#fontfamilycss)
   * [cubicBezier/css](/reference/hooks/transforms/predefined#cubicbezier)
   * [strokeStyle/css/shorthand](/reference/hooks/transforms/predefined#strokestylecssshorthand)
   * [border/css/shorthand](/reference/hooks/transforms/predefined#bordercssshorthand)
   * [typography/css/shorthand](/reference/hooks/transforms/predefined#typographycssshorthand)
   * [transition/css/shorthand](/reference/hooks/transforms/predefined#transitioncssshorthand)
   * [shadow/css/shorthand](/reference/hooks/transforms/predefined#shadowcssshorthand)
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
    'fontFamily/css',
    'cubicBezier/css',
    // object-value tokens
    'strokeStyle/css/shorthand',
    'border/css/shorthand',
    'typography/css/shorthand',
    'transition/css/shorthand',
    'shadow/css/shorthand',
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [attribute/color](/reference/hooks/transforms/predefined#attributecolor)
   * [name/human](/reference/hooks/transforms/predefined#namehuman)
   *
   * @memberof TransformGroups
   */
  html: ['attribute/cti', 'attribute/color', 'name/human'],
  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/snake](/reference/hooks/transforms/predefined#namectisnake)
   * [color/hex8android](/reference/hooks/transforms/predefined#colorhex8android)
   * [size/remToSp](/reference/hooks/transforms/predefined#sizeremtosp)
   * [size/remToDp](/reference/hooks/transforms/predefined#sizeremtodp)
   *
   * @memberof TransformGroups
   */
  android: ['attribute/cti', 'name/snake', 'color/hex8android', 'size/remToSp', 'size/remToDp'],
  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/camel](/reference/hooks/transforms/predefined#namecamel)
   * [color/composeColor](/reference/hooks/transforms/predefined#colorcomposecolor)
   * [size/compose/em](/reference/hooks/transforms/predefined#sizecomposeem)
   * [size/compose/remToSp](/reference/hooks/transforms/predefined#sizecomposeremtosp)
   * [size/compose/remToDp](/reference/hooks/transforms/predefined#sizecomposeremtodp)
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
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/pascal](/reference/hooks/transforms/predefined#namectipascal)
   * [color/UIColor](/reference/hooks/transforms/predefined#coloruicolor)
   * [content/objC/literal](/reference/hooks/transforms/predefined#contentobjcliteral)
   * [asset/objC/literal](/reference/hooks/transforms/predefined#assetobjcliteral)
   * [size/remToPt](/reference/hooks/transforms/predefined#sizeremtopt)
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
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/camel](/reference/hooks/transforms/predefined#namecamel)
   * [color/UIColorSwift](/reference/hooks/transforms/predefined#coloruicolorswift)
   * [content/swift/literal](/reference/hooks/transforms/predefined#contentswiftliteral)
   * [asset/swift/literal](/reference/hooks/transforms/predefined#assetswiftliteral)
   * [size/swift/remToCGFloat](/reference/hooks/transforms/predefined#sizeswiftremtocgfloat)
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
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/camel](/reference/hooks/transforms/predefined#namecamel)
   * [color/UIColorSwift](/reference/hooks/transforms/predefined#coloruicolorswift)
   * [content/swift/literal](/reference/hooks/transforms/predefined#contentswiftliteral)
   * [asset/swift/literal](/reference/hooks/transforms/predefined#assetswiftliteral)
   * [size/swift/remToCGFloat](/reference/hooks/transforms/predefined#sizeswiftremtocgfloat)
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
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   *
   * @memberof TransformGroups
   */
  assets: ['attribute/cti'],
  /**
   * Transforms:
   *
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/camel](/reference/hooks/transforms/predefined#nameccamel)
   * [color/hex8flutter](/reference/hooks/transforms/predefined#colorhex8flutter)
   * [size/flutter/remToDouble](/reference/hooks/transforms/predefined#sizeflutterremtodouble)
   * [content/flutter/literal](/reference/hooks/transforms/predefined#contentflutterliteral)
   * [asset/flutter/literal](/reference/hooks/transforms/predefined#assetflutterliteral)
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
   * [attribute/cti](/reference/hooks/transforms/predefined#attributecti)
   * [name/camel](/reference/hooks/transforms/predefined#namecamel)
   * [color/hex8flutter](/reference/hooks/transforms/predefined#colorhex8flutter)
   * [size/flutter/remToDouble](/reference/hooks/transforms/predefined#sizeflutterremtodouble)
   * [content/flutter/literal](/reference/hooks/transforms/predefined#contentflutterliteral)
   * [asset/flutter/literal](/reference/hooks/transforms/predefined#assetflutterliteral)
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
   * [name/camel](/reference/hooks/transforms/predefined#namecamel)
   * [size/object](/reference/hooks/transforms/predefined#sizeobject)
   * [color/css](/reference/hooks/transforms/predefined#colorcss)
   *
   * @memberof TransformGroups
   */
  'react-native': ['name/camel', 'color/css', 'size/object'],
};
