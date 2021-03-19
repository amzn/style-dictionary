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
const sortBy = (key) => {
  return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

describe('utils', () => {
  describe('flattenProperties', () => {

    it('should return an empty array', () => {
      var ret = flattenProperties({});
      expect(ret).toEqual([]);
    });

    it('should return the same array', () => {
      var to_ret = [];
      var ret = flattenProperties({}, to_ret);
      expect(ret).toBe(ret);
    });

    it('should return leaf node values as an array', () => {
      var properties = {
        'black': {
          'value': '#000000'
        },
        'white': {
          'value': '#FFFFFF'
        }
      };

      var expected_ret = [
        properties.black,
        properties.white
      ];

      var sortedExpectedRet = expected_ret.sort(sortBy('value'));
      var ret = flattenProperties(properties);
      var sortedRet = ret.sort(sortBy('value'));
      expect(sortedRet).toEqual(sortedExpectedRet);
    });

    it('should return nested leaf node values as an array', () => {
      var properties = {
        'color': {
          'black': {
            'value': '#000000'
          },
          'white': {
            'value': '#FFFFFF'
          }
        }
      };

      var expected_ret = [
        properties.color.black,
        properties.color.white
      ];

      var sortedExpectedRet = expected_ret.sort(sortBy('value'));
      var ret = flattenProperties(properties);
      var sortedRet = ret.sort(sortBy('value'));
      expect(sortedRet).toEqual(sortedExpectedRet);
    });
  });
});
