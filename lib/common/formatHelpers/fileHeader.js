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

// no-op default
const defaultFileHeader = (arr) => arr

/**
 *
 * This is for creating the comment at the top of generated files with the generated at date.
 * It will use the custom file header if defined on the configuration, or use the
 * default file header.
 * @memberof module:formatHelpers
 * @param {File} file - The file object that is passed to the formatter.
 * @param {String} commentStyle - The only options are 'short' and 'xml', which will use the // or \<!-- --> style comments respectively. Anything else will use \/\* style comments.
 * @returns {String}
 * @example
 * ```js
 * StyleDictionary.registerFormat({
 *   name: 'myCustomFormat',
 *   formatter: function({ dictionary, file }) {
 *     return fileHeader(file, 'short') +
 *       dictionary.allProperties.map(token => `${token.name} = ${token.value}`)
 *         .join('\n');
 *   }
 * });
 * ```
 */
function fileHeader(file, commentStyle) {
  // showFileHeader is true by default
  let showFileHeader = true;
  if (file.options && typeof file.options.showFileHeader !== 'undefined') {
    showFileHeader = file.options.showFileHeader;
  }

  // Return empty string if the showFileHeader is false
  if (!showFileHeader) return '';

  let fn = defaultFileHeader;
  if (file.options && typeof file.options.fileHeader === 'function') {
    fn = file.options.fileHeader;
  }

  // default header
  const defaultHeader = [
    `Do not edit directly`,
    `Generated on ${new Date().toUTCString()}`
  ];
  let commentPrefix, commentHeader, commentFooter;
  if (showFileHeader) {
    if (commentStyle === 'short') {
      commentPrefix = '// ';
      commentHeader = '\n';
      commentFooter = '\n\n';
    } else if (commentStyle === 'xml') {
      commentPrefix = '  ';
      commentHeader = '<!--\n';
      commentFooter = '\n-->';
    } else {
      commentPrefix = ' * ';
      commentHeader = '/**\n';
      commentFooter = '\n */\n\n';
    }
  }

  return `${commentHeader}${fn(defaultHeader)
    .map(line => `${commentPrefix}${line}`)
    .join('\n')}${commentFooter}`;
}

module.exports = fileHeader;