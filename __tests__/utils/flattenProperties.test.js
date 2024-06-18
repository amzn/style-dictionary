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
import { expect } from 'chai';
import flattenTokens from '../../dist/esm/utils/flattenTokens.mjs';

const sortBy = (key) => {
  return (a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0);
};

describe('utils', () => {
  describe('flattenTokens', () => {
    it('should return an empty array', () => {
      const ret = flattenTokens({});
      expect(ret).to.eql([]);
    });

    it('should return the same array', () => {
      const to_ret = [];
      const ret = flattenTokens({}, to_ret);
      expect(ret).to.equal(ret);
    });

    it('should return leaf node values as an array', () => {
      const tokens = {
        black: {
          value: '#000000',
        },
        white: {
          value: '#FFFFFF',
        },
      };

      const expected_ret = [tokens.black, tokens.white];

      const sortedExpectedRet = expected_ret.sort(sortBy('value'));
      const ret = flattenTokens(tokens);
      const sortedRet = ret.sort(sortBy('value'));
      expect(sortedRet).to.eql(sortedExpectedRet);
    });

    it('should return nested leaf node values as an array', () => {
      const tokens = {
        color: {
          black: {
            value: '#000000',
          },
          white: {
            value: '#FFFFFF',
          },
        },
      };

      const expected_ret = [tokens.color.black, tokens.color.white];

      const sortedExpectedRet = expected_ret.sort(sortBy('value'));
      const ret = flattenTokens(tokens);
      const sortedRet = ret.sort(sortBy('value'));
      expect(sortedRet).to.eql(sortedExpectedRet);
    });
  });
});
