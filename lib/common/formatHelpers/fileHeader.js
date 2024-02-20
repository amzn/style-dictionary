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
 * @typedef {import('../../../types/File.d.ts').File} File
 * @typedef {import('../../../types/File.d.ts').FileHeader} FileHeader
 * @typedef {import('../../../types/File.d.ts').FormattingOptions} Formatting
 */

const lineSeparator = `\n`;
/** @type {Formatting} */
const defaultFormatting = {
  lineSeparator,
  prefix: ` * `,
  header: `/**${lineSeparator}`,
  footer: `${lineSeparator} */${lineSeparator}${lineSeparator}`,
};

/**
 *
 * This is for creating the comment at the top of generated files with the generated at date.
 * It will use the custom file header if defined on the configuration, or use the
 * default file header.
 * @memberof module:formatHelpers
 * @name fileHeader
 * @param {Object} options
 * @param {File} [options.file] - The file object that is passed to the formatter.
 * @param {'short' | 'xml' | 'long'} [options.commentStyle] - The only options are 'short', 'xml' and 'long', which will use the // or \<!-- --> or \/\* style comments respectively. Default fallback is 'long'.
 * @param {Formatting} [options.formatting] - Custom formatting properties that define parts of a comment in code. The configurable strings are: prefix, lineSeparator, header, and footer.
 * @returns {Promise<string>}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, file }) {
 *     return fileHeader({file, commentStyle: 'short'}) +
 *       dictionary.allTokens.map(token => `${token.name} = ${token.value}`)
 *         .join('\n');
 *   }
 * });
 * ```
 */
export default async function fileHeader({ file, commentStyle, formatting = {} }) {
  // showFileHeader is true by default
  let showFileHeader = true;
  if (typeof file?.options?.showFileHeader !== 'undefined') {
    showFileHeader = file.options.showFileHeader;
  }

  // Return empty string if the showFileHeader is false
  if (!showFileHeader) return '';

  /**
   * @type {FileHeader}
   */
  let fn = (arr) => arr;
  if (typeof file?.options?.fileHeader === 'function') {
    fn = file.options.fileHeader;
  }

  // default header
  const defaultHeader = [`Do not edit directly`, `Generated on ${new Date().toUTCString()}`];

  let { prefix, lineSeparator, header, footer } = Object.assign({}, defaultFormatting, formatting);

  if (commentStyle === 'short') {
    prefix = `// `;
    header = `${lineSeparator}`;
    footer = `${lineSeparator}${lineSeparator}`;
  } else if (commentStyle === 'xml') {
    prefix = `  `;
    header = `<!--${lineSeparator}`;
    footer = `${lineSeparator}-->`;
  }

  const headerContent = await fn(defaultHeader);

  return `${header}${headerContent
    .map(/** @param {string} line */ (line) => `${prefix}${line}`)
    .join(lineSeparator)}${footer}`;
}
