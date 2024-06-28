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

import usesReferences from '../../utils/references/usesReferences.js';
import { getReferences } from '../../utils/references/getReferences.js';

/**
 * @typedef {import('../../../types/DesignToken.ts').TransformedTokens} Tokens
 * @typedef {import('../../../types/DesignToken.ts').TransformedToken} Token
 */

/**
 * A function that returns a sorting function to be used with Array.sort that
 * will sort the allTokens array based on references. This is to make sure
 * if you use output references that you never use a reference before it is
 * defined.
 * @memberof module:formatHelpers
 * @name sortByReference
 * @example
 * ```javascript
 * dictionary.allTokens.sort(sortByReference(dictionary))
 * ```
 * @param {Tokens} tokens
 * @param {{unfilteredTokens?: Tokens}} [opts]
 * @returns {(a: Token, b: Token) => number}
 */
export default function sortByReference(tokens, opts) {
  /**
   * The sorter function is recursive to account for multiple levels of nesting
   * @param {Token} a
   * @param {Token} b
   * @returns
   */
  function sorter(a, b) {
    const aComesFirst = -1;
    const bComesFirst = 1;

    // return early if a or b ar undefined
    if (typeof a === 'undefined') {
      return aComesFirst;
    } else if (typeof b === 'undefined') {
      return bComesFirst;
    }

    // If token a uses a reference and token b doesn't, b might come before a
    // read on..
    if (a.original && usesReferences(a.original.value)) {
      // Both a and b have references, we need to see if they reference each other
      if (b.original && usesReferences(b.original.value)) {
        const aRefs = getReferences(a.original.value, tokens, {
          unfilteredTokens: opts?.unfilteredTokens,
          warnImmediately: false,
        });
        const bRefs = getReferences(b.original.value, tokens, {
          unfilteredTokens: opts?.unfilteredTokens,
          warnImmediately: false,
        });

        aRefs.forEach((aRef) => {
          // a references b, we want b to come first
          if (aRef.name === b.name) {
            return bComesFirst;
          }
        });

        bRefs.forEach((bRef) => {
          // ditto but opposite
          if (bRef.name === a.name) {
            return aComesFirst;
          }
        });

        // both a and b have references and don't reference each other
        // we go further down the rabbit hole (reference chain)
        return sorter(aRefs[0], bRefs[0]);
      } else {
        // a has a reference and b does not:
        return bComesFirst;
      }
      // a does not have a reference it should come first regardless if b has one
    } else {
      return aComesFirst;
    }
  }

  return sorter;
}
