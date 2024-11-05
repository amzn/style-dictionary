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

import createPropertyFormatter from './createPropertyFormatter.js';
import sortByReference from './sortByReference.js';

/**
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedTokens} Tokens
 * @typedef {import('../../../types/File.d.ts').FormattingOptions} Formatting
 * @typedef {import('../../../types/Format.d.ts').OutputReferences} OutputReferences
 * @typedef {import('../../../types/DesignToken.d.ts').Dictionary} Dictionary
 */

const defaultFormatting = {
  lineSeparator: '\n',
};

/**
 *
 * This is used to create lists of variables like Sass variables or CSS custom properties
 * @memberof module:formatHelpers
 * @name formattedVariables
 * @param {Object} options
 * @param {String} options.format - What type of variables to output. Options are: css, sass, less, and stylus
 * @param {Dictionary} options.dictionary - The dictionary object that gets passed to the format method.
 * @param {OutputReferences} [options.outputReferences] - Whether or not to output references
 * @param {Boolean} [options.outputReferenceFallbacks] - Whether or not to output a faLLback value for output references
 * @param {Formatting} [options.formatting] - Custom formatting properties that define parts of a declaration line in code. This will get passed to `formatHelpers` -> `createPropertyformat` and used for the `lineSeparator` between lines of code.
 * @param {Boolean} [options.themeable] [false] - Whether tokens should default to being themeable.
 * @param {boolean} [options.usesDtcg] [false] - Whether DTCG token syntax should be uses.
 * @returns {String}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   format: function({ dictionary, options }) {
 *     return formattedVariables({
 *       format: 'less',
 *       dictionary,
 *       outputReferences: options.outputReferences
 *     });
 *   }
 * });
 * ```
 */
export default function formattedVariables({
  format,
  dictionary,
  outputReferences = false,
  outputReferenceFallbacks,
  formatting = {},
  themeable = false,
  usesDtcg = false,
}) {
  // typecast, we know that by know the tokens have been transformed
  let allTokens = /** @type {Token[]} */ (dictionary.allTokens);
  /** @type {Tokens} */
  const tokens = dictionary.tokens;

  let { lineSeparator } = Object.assign({}, defaultFormatting, formatting);

  // Some languages are imperative, meaning a variable has to be defined
  // before it is used. If `outputReferences` is true, check if the token
  // has a reference, and if it does send it to the end of the array.
  // We also need to account for nested references, a -> b -> c. They
  // need to be defined in reverse order: c, b, a so that the reference always
  // comes after the definition
  if (outputReferences) {
    // note: using the spread operator here so we get a new array rather than
    // mutating the original
    allTokens = [...allTokens].sort(
      sortByReference(tokens, { unfilteredTokens: dictionary.unfilteredTokens, usesDtcg }),
    );
  }

  return allTokens
    .map(
      createPropertyFormatter({
        outputReferences,
        outputReferenceFallbacks,
        dictionary,
        format,
        formatting,
        themeable,
        usesDtcg,
      }),
    )
    .filter(function (strVal) {
      return !!strVal;
    })
    .join(lineSeparator);
}
