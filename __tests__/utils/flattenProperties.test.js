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

var flattenProperties = require('../../lib/utils/flattenProperties');

describe('flattenProperties', () => {
  it('returns empty array when called without arguments', () => {
    expect(flattenProperties()).toEqual([]);
  });

  it('returns expected array for object', () => {
    const properties = {
      "size": {
        "font": {
          "base": {
            "value": "16",
            "comment": "the base size of the font"
          },
          "large": {
            "value": "20",
            "comment": "the large size of the font"
          }
        }
      },
      "color": "#FFFF00"
    };

    const expected = [
      {
        "comment": "the base size of the font",
        "value": "16"
      },
      {
        "comment": "the large size of the font",
        "value": "20"
      }
    ];

    const actual = flattenProperties(properties);
    expect(actual).toEqual(expected);
  })
});
