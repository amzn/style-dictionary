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

/**
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../../types/Config.d.ts').Config} Options
 * @typedef {import('../../../types/Config.d.ts').PlatformConfig} PlatformConfig
 */

/**
 *
 * This is used to create CSS (and CSS pre-processor) lists of icons. It assumes you are
 * using an icon font and creates helper classes with the :before pseudo-selector to add
 * a unicode character.
 * __You probably don't need this.__
 * @memberof module:formatHelpers
 * @name iconsWithPrefix
 * @param {String} prefix - Character to prefix variable names, like '$' for Sass
 * @param {Token[]} allTokens - allTokens array on the dictionary object passed to the format function.
 * @param {Options} options - options object passed to the format function.
 * @param {PlatformConfig} platform - platform specific options
 * @returns {String}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   format: function({ dictionary, options }) {
 *     return iconsWithPrefix('$', dictionary.allTokens, options);
 *   }
 * });
 * ```
 */
export default function iconsWithPrefix(prefix, allTokens, options, platform) {
  return allTokens
    .filter(function (token) {
      return token.type === 'icon';
    })
    .map(function (token) {
      const varName =
        prefix + token.name + ': ' + (options.usesDtcg ? token.$value : token.value) + ';';
      const className = '.' + platform.prefix + '-icon.' + token.attributes?.item + ':before ';
      const declaration = '{ content: ' + prefix + token.name + '; }';
      return varName + '\n' + className + declaration;
    })
    .join('\n');
}
