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

import { usesReferences, getReferences } from 'style-dictionary/utils';

/**
 * @typedef {import('../../../../types/DesignToken.d.ts').Dictionary} Dictionary
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedToken} Token
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedTokens} Tokens
 * @typedef {import('../../../../types/File.d.ts').File} File
 * @typedef {import('../../../../types/Config.d.ts').Config} Config
 * @typedef {import('../../formatHelpers/fileHeader.js').default} FileHeader
 */

/**
 * @param {{
 *   dictionary: Dictionary;
 *   file?: File;
 *   fileHeader?: FileHeader;
 *   options: Config
 * }} opts
 */
export default (opts) => {
  const { file, fileHeader, dictionary, options } = opts;

  const resourceType = file?.resourceType || null;

  const resourceMap = file?.resourceMap || {
    size: 'dimen',
    color: 'color',
    string: 'string',
    content: 'string',
    time: 'integer',
    number: 'integer',
  };

  /**
   * @param {Token} token
   * @returns {string}
   */
  function tokenToType(token) {
    if (resourceType) {
      return resourceType;
    }
    if (token.attributes?.category && resourceMap[token.attributes.category]) {
      return resourceMap[token.attributes.category];
    }
    return 'string';
  }

  /**
   * @param {Token} token
   * @param {Tokens} tokens
   * @returns {string}
   */
  function tokenToValue(token, tokens) {
    if (file?.options && file.options.outputReferences && usesReferences(token.original.value)) {
      return `@${tokenToType(token)}/${getReferences(token.original.value, tokens)[0].name}`;
    } else {
      return options.usesW3C ? token.$value : token.value;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>

${fileHeader ? fileHeader({ file, commentStyle: 'xml' }) : ''}
<resources>
  ${
    /** @type {Token[]} */ (dictionary.allTokens)
      .map(
        (token) =>
          `<${tokenToType(token)} name="${token.name}">${tokenToValue(
            token,
            dictionary.tokens,
          )}</${tokenToType(token)}>${token.comment ? `<!-- ${token.comment} -->` : ''}`,
      )
      .join(`\n  `)
  }
</resources>`;
};
