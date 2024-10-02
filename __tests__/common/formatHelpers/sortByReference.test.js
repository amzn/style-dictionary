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
import sortByReference from '../../../lib/common/formatHelpers/sortByReference.js';

const TRANSFORMED_TOKENS = (usesDtcg) => {
  const valueKey = usesDtcg ? '$value' : 'value';
  const typeKey = usesDtcg ? '$type' : 'type';

  return {
    color: {
      primary: {
        [valueKey]: '#FF0000',
        [typeKey]: 'color',
        original: {
          [valueKey]: '{color.red}',
          [typeKey]: 'color',
        },
      },
      red: {
        [valueKey]: '#FF0000',
        [typeKey]: 'color',
        original: {
          [valueKey]: '#FF0000',
          [typeKey]: 'color',
        },
      },
    },
  };
};

describe('common', () => {
  describe('formatHelpers', () => {
    describe('sortByReference', () => {
      [
        ['default', false, TRANSFORMED_TOKENS(false)],
        ['dtcg', true, TRANSFORMED_TOKENS(true)],
      ].forEach(([tokenFormat, usesDtcg, tokens]) => {
        it(`should keep order when idx0 has no reference(${tokenFormat})`, () => {
          const allTokens = [tokens.color.red, tokens.color.primary];

          const sorted = [...allTokens].sort(
            sortByReference(tokens, {
              usesDtcg,
            }),
          );

          expect(sorted).to.eql([tokens.color.red, tokens.color.primary]);
        });
        it(`should reorder, if idx0 references idx1 (${tokenFormat})`, () => {
          const allTokens = [tokens.color.primary, tokens.color.red];

          const sorted = [...allTokens].sort(
            sortByReference(tokens, {
              usesDtcg,
            }),
          );

          expect(sorted).to.eql([tokens.color.red, tokens.color.primary]);
        });
      });
      it('should reorder when idx0 is undefined', () => {
        const tokens = TRANSFORMED_TOKENS(false);
        const tokensWithAnUndefinedValue = {
          ...tokens,
          color: { ...tokens.color, primary: undefined },
        };
        const allTokens = [
          tokensWithAnUndefinedValue.color.primary,
          tokensWithAnUndefinedValue.color.red,
        ];

        const sorted = [...allTokens].sort(sortByReference(tokensWithAnUndefinedValue));

        expect(sorted).to.eql([
          tokensWithAnUndefinedValue.color.red,
          tokensWithAnUndefinedValue.color.primary,
        ]);
      });
      it('should keep order when idx1 is undefined', () => {
        const tokens = TRANSFORMED_TOKENS(false);
        const tokensWithUndefinedValue = {
          ...tokens,
          color: { ...tokens.color, primary: undefined },
        };
        const allTokens = [
          tokensWithUndefinedValue.color.red,
          tokensWithUndefinedValue.color.primary,
        ];

        const sorted = [...allTokens].sort(sortByReference(tokensWithUndefinedValue));

        expect(sorted).to.eql([
          tokensWithUndefinedValue.color.red,
          tokensWithUndefinedValue.color.primary,
        ]);
      });
    });
  });
});
