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
import { restore, stubMethod } from 'hanbi';
import { getReferences } from '../../../lib/utils/references/getReferences.js';

const tokens = {
  color: {
    red: { value: '#f00' },
    danger: { value: '{color.red.value}' },
  },
  size: {
    border: { value: '2px' },
  },
  border: {
    primary: {
      // getReferences should work on objects like this:
      value: {
        color: '{color.red.value}',
        width: '{size.border.value}',
        style: 'solid',
      },
    },
    secondary: {
      // and objects that have a non-string
      value: {
        color: '{color.red.value}',
        width: 2,
        style: 'solid',
      },
    },
    tertiary: {
      // getReferences should work on interpolated values like this:
      value: '{size.border.value} solid {color.red.value}',
    },
  },
};

describe('utils', () => {
  describe('reference', () => {
    describe('getReferences()', () => {
      describe('public API', () => {
        beforeEach(() => {
          restore();
        });

        it('should not collect errors but rather throw immediately when using public API', () => {
          expect(() => getReferences('{foo.bar}', tokens)).to.throw(
            `Tries to reference foo.bar, which is not defined.`,
          );
        });

        it('should not collect errors but rather throw immediately when using public API', async () => {
          const badFn = () => getReferences('{foo.bar}', tokens);
          expect(badFn).to.throw(`Tries to reference foo.bar, which is not defined.`);
        });

        it('should allow warning immediately when references are filtered out', async () => {
          const stub = stubMethod(console, 'warn');
          const clonedTokens = structuredClone(tokens);
          delete clonedTokens.color.red;
          getReferences('{color.red}', clonedTokens, {
            unfilteredTokens: tokens,
            warnImmediately: true,
          });
          expect(stub.firstCall.args[0]).to.equal(
            `Filtered out token references were found: color.red`,
          );
        });
      });

      it(`should return an empty array if the value has no references`, () => {
        expect(getReferences(tokens.color.red.value, tokens)).to.eql([]);
      });

      it(`should work with a single reference`, () => {
        expect(getReferences(tokens.color.danger.value, tokens)).to.eql([
          { ref: ['color', 'red'], value: '#f00' },
        ]);
      });

      it(`should work with object values`, () => {
        expect(getReferences(tokens.border.primary.value, tokens)).to.eql([
          { ref: ['color', 'red'], value: '#f00' },
          { ref: ['size', 'border'], value: '2px' },
        ]);
      });

      it(`should work with objects that have numbers`, () => {
        expect(getReferences(tokens.border.secondary.value, tokens)).to.eql([
          { ref: ['color', 'red'], value: '#f00' },
        ]);
      });

      it(`should work with interpolated values`, () => {
        expect(getReferences(tokens.border.tertiary.value, tokens)).to.eql([
          { ref: ['size', 'border'], value: '2px' },
          { ref: ['color', 'red'], value: '#f00' },
        ]);
      });
    });
  });
});
