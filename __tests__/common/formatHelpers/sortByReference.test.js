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

const TRANSFORMED_TOKENS = (dtcg) => ({
  color: {
    primary: {
      [`${dtcg ? '$' : ''}value`]: '#FF0000',
      [`${dtcg ? '$' : ''}type`]: 'color',
      original: { 
        [`${dtcg ? '$' : ''}value`]: '{color.red}',
        [`${dtcg ? '$' : ''}type`]: 'color' },
    },
    red: {
      [`${dtcg ? '$' : ''}value`]: '#FF0000',
      [`${dtcg ? '$' : ''}type`]: 'color',
      original: { 
        [`${dtcg ? '$' : ''}value`]: '#FF0000',
        [`${dtcg ? '$' : ''}type`]: 'color' },
    },
  },
});

describe('common', () => {
  describe('formatHelpers', () => {
    describe('sortByReference', () => {
      [
        ['default', false, DEFAULT_TRANSFORMED_TOKENS],
        ['dtcg', true, DTCG_TRANSFORMED_TOKENS],
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
        const transformedTokensWithUndefined = {
          ...DEFAULT_TRANSFORMED_TOKENS,
          color: { ...DEFAULT_TRANSFORMED_TOKENS.color, primary: undefined },
        };
        const allTokens = [
          transformedTokensWithUndefined.color.primary,
          transformedTokensWithUndefined.color.red,
        ];

        const sorted = [...allTokens].sort(sortByReference(transformedTokensWithUndefined));

        expect(sorted).to.eql([
          transformedTokensWithUndefined.color.red,
          transformedTokensWithUndefined.color.primary,
        ]);
      });
      it('should keep order when idx1 is undefined', () => {
        const transformedTokensWithUndefined = {
          ...DEFAULT_TRANSFORMED_TOKENS,
          color: { ...DEFAULT_TRANSFORMED_TOKENS.color, primary: undefined },
        };
        const allTokens = [
          transformedTokensWithUndefined.color.red,
          transformedTokensWithUndefined.color.primary,
        ];

        const sorted = [...allTokens].sort(sortByReference(transformedTokensWithUndefined));

        expect(sorted).to.eql([
          transformedTokensWithUndefined.color.red,
          transformedTokensWithUndefined.color.primary,
        ]);
      });
    });
  });
});
