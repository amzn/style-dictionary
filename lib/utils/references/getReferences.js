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
import getPathFromName from './getPathFromName.js';
import createReferenceRegex from './createReferenceRegex.js';
import getValueByPath from './getValueByPath.js';
import GroupMessages from '../groupMessages.js';
import defaults from './defaults.js';

const FILTER_WARNINGS = GroupMessages.GROUP.FilteredOutputReferences;

/**
 * @typedef {import('../../../types/Config.d.ts').GetReferencesOptions} GetReferencesOptions
 * @typedef {import('../../StyleDictionary.js').default} Dictionary
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedTokens} Tokens
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedToken} Token
 */

/**
 * This is a helper function that is added to the dictionary object that
 * is passed to formats and actions. It will resolve a reference giving
 * you access to the token (not just the value) that a value references.
 * This allows formats to have variable references in the output. For example:
 *
 * ```css
 * --color-background-base: var(--color-core-white);
 * ```
 *
 * @param {string|Object<string, string|any>} value the value that contains a reference
 * @param {Tokens} tokens the dictionary to search in
 * @param {GetReferencesOptions} [opts]
 * @param {Token[]} [references] array of token's references because a token's value can contain multiple references due to string interpolation
 * @returns {Token[]}
 */
export function getReferences(value, tokens, opts = {}, references = []) {
  const { usesDtcg, separator, warnImmediately = true, unfilteredTokens } = opts;
  const regex = createReferenceRegex(opts);

  /**
   * this will update the references array with the referenced tokens it finds.
   * @param {string} _
   * @param {string} variable
   */
  function findReference(_, variable) {
    // remove 'value' to access the whole token object
    variable = variable.trim().replace(`.${usesDtcg ? '$' : ''}value`, '');

    // Find what the value is referencing
    const pathName = getPathFromName(variable, separator ?? defaults.separator);

    let ref = getValueByPath(pathName, tokens);

    let unfilteredWarning;
    if (ref === undefined && unfilteredTokens) {
      // warn the user about this
      if (warnImmediately) {
        unfilteredWarning = `Filtered out token references were found: ${variable}`;
      } else {
        // we collect the warning and warn later in the process
        GroupMessages.add(FILTER_WARNINGS, variable);
      }
      // fall back on unfilteredTokens as it is unfiltered
      ref = getValueByPath(pathName, unfilteredTokens);
    }

    if (ref !== undefined) {
      references.push({ ...ref, ref: pathName });
      // not undefined anymore which means that if unfilteredWarning was set earlier,
      // the missing ref is due to it being filtered out
      if (unfilteredWarning) {
        console.warn(unfilteredWarning);
      }
    } else {
      const errMessage = `Tries to reference ${variable}, which is not defined.`;
      if (warnImmediately) {
        throw new Error(errMessage);
      }
    }
    return '';
  }

  if (typeof value === 'string') {
    // function inside .replace runs multiple times if there are multiple matches
    // TODO: we don't need the replace's return value, consider using something else here
    value.replace(regex, findReference);
  }

  // If the token's value is an object, run the replace reference
  // on each value within that object. This mirrors the `usesReferences`
  // function which iterates over the object to see if there is a reference
  if (typeof value === 'object') {
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        if (typeof value[key] === 'string') {
          value[key].replace(regex, findReference);
        }
        // if it is an object, we go further down the rabbit hole
        if (typeof value[key] === 'object') {
          getReferences(value[key], tokens, opts, references);
        }
      }
    }
  }

  return references;
}
