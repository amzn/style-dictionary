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

module.exports = {
  'web': [
    'attribute/cti',
    'name/cti/kebab',
    'size/px'
  ],
  'scss': [
    'attribute/cti',
    'name/cti/kebab',
    'time/seconds',
    'content/icon',
    'size/rem',
    'color/hex'
  ],
  'html': [
    'attribute/cti',
    'attribute/color',
    'name/human'
  ],
  'android': [
    'attribute/cti',
    'name/cti/snake',
    'color/hex',
    'size/remToSp',
    'size/remToDp'
  ],
  'ios': [
    'attribute/cti',
    'name/cti/pascal',
    'color/UIColor',
    'content/objC/literal',
    'asset/objC/literal',
    'size/remToPt',
    'font/objC/literal'
  ],
  'assets': [
    'attribute/cti'
  ]
};
