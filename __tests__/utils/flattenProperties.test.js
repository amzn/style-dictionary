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
      var sortFn = function (a, b) {
        if (a.value > b.value) return 1;
        if (b.value > a.value) return -1;
        return 0;
      }
      var sortedExpectedRet = expected_ret.sort(sortFn);
      var ret = flattenProperties(properties);
      var sortedRet = ret.sort(sortFn);
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
      var sortFn = function (a, b) {
        if (a.value > b.value) return 1;
        if (b.value > a.value) return -1;
        return 0;
      }
      var sortedExpectedRet = expected_ret.sort(sortFn);
      var ret = flattenProperties(properties);
      var sortedRet = ret.sort(sortFn);
      expect(sortedRet).toEqual(sortedExpectedRet);
    });
  });
});
