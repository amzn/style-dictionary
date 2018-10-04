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

  it('returns empty array for an object with one leaf without a value property', () => {
    const properties = {
      "leaf": {
        "color": "#FFFF00"
      }
    };

    const expected = [];

    const actual = flattenProperties(properties);
    expect(actual).toEqual(expected);
  })

  it('returns expected array for an object with one leaf with a value property', () => {
    const properties = {
      "leaf": {
        "value": "#FFFF00"
      }
    };

    const expected = [{"value": "#FFFF00"}];

    const actual = flattenProperties(properties);
    expect(actual).toEqual(expected);
  })

  it('returns expected array for an object with tree leafs with and with value property', () => {
    const properties = {
      "leaf1": {
        "value": "#FFFF00"
      },
      "leaf2": {
        "size": "20"
      },
      "leaf3": {
        "value": "16"
      }
    };

    const expected =   [{"value": "#FFFF00"}, {"value": "16"}];

    const actual = flattenProperties(properties);
    expect(actual).toEqual(expected);
  })
});
