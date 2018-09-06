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

module.exports = {

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/kebab](transforms.md#namectikebab)
   * [size/px](transforms.md#sizepx)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  'web': [
    'attribute/cti',
    'name/cti/kebab',
    'size/px',
    'color/css'
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/pascal](transforms.md#namectipascal)
   * [size/rem](transforms.md#sizerem)
   * [color/hex](transforms.md#colorhex)
   *
   * @memberof TransformGroups
   */
  'js': [
    'attribute/cti',
    'name/cti/pascal',
    'size/rem',
    'color/hex'
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/kebab](transforms.md#namectikebab)
   * [time/seconds](transforms.md#timeseconds)
   * [content/icon](transforms.md#contenticon)
   * [size/rem](transforms.md#sizerem)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  'scss': [
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css'
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/kebab](transforms.md#namectikebab)
   * [time/seconds](transforms.md#timeseconds)
   * [content/icon](transforms.md#contenticon)
   * [size/rem](transforms.md#sizerem)
   * [color/css](transforms.md#colorcss)
   *
   * @memberof TransformGroups
   */
  'css': [
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/css'
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/kebab](transforms.md#namectikebab)
   * [time/seconds](transforms.md#timeseconds)
   * [content/icon](transforms.md#contenticon)
   * [size/rem](transforms.md#sizerem)
   * [color/hex](transforms.md#colorhex)
   *
   * @memberof TransformGroups
   */
  'less': [
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/hex'
  ],

  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [attribute/color](transforms.md#attributecolor)
   * [name/human](transforms.md#namehuman)
   *
   * @memberof TransformGroups
   */
  'html': [
    'attribute/cti',
    'attribute/color',
    'name/human'
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/snake](transforms.md#namectisnake)
   * [color/hex8android](transforms.md#colorhex8android)
   * [size/remToSp](transforms.md#sizeremtosp)
   * [size/remToDp](transforms.md#sizeremtodp)
   *
   * @memberof TransformGroups
   */
  'android': [
    'attribute/cti',
    'name/cti/snake',
    'color/hex8android',
    'size/remToSp',
    'size/remToDp'
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   * [name/cti/pascal](transforms.md#namectipascal)
   * [color/UIColor](transforms.md#coloruicolor)
   * [content/objC/literal](transforms.md#contentobjcliteral)
   * [asset/objC/literal](transforms.md#assetobjcliteral)
   * [size/remToPt](transforms.md#sizeremtopt)
   * [font/objC/literal](transforms.md#fontobjcliteral)
   *
   * @memberof TransformGroups
   */
  'ios': [
    'attribute/cti',
    'name/cti/pascal',
    'color/UIColor',
    'content/objC/literal',
    'asset/objC/literal',
    'size/remToPt',
    'font/objC/literal'
  ],
  /**
   * Transforms:
   *
   * [attribute/cti](transforms.md#attributecti)
   *
   * @memberof TransformGroups
   */
  'assets': [
    'attribute/cti'
  ]
};
