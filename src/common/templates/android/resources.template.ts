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

import type { Config, TransformedToken, TransformedTokens } from '../../../types';
import type { InternalFnArguments } from '../../../types/Format';
import { usesReferences, getReferences } from '../../../utils';

/**
 * @param {{
 *   dictionary: Dictionary;
 *   file?: File;
 *   header?: string;
 *   options: Config
 * }} opts
 */
export default (opts: Omit<InternalFnArguments, 'platform'>) => {
  const { file, header, dictionary, options } = opts;

  const resourceType = file?.options?.resourceType || null;

  const resourceMap = file?.options?.resourceMap || {
    dimension: 'dimen',
    fontSize: 'dimen',
    color: 'color',
    string: 'string',
    content: 'string',
    time: 'integer',
    number: 'integer',
  };

  /**
   * @param {Token} token
   * @param {Config} options
   * @returns {string}
   */
  function tokenToType(token: TransformedToken, options: Config) {
    const type = options.usesDtcg ? token.$type : token.type;
    if (resourceType) {
      return resourceType;
    }
    if (type && resourceMap[type]) {
      return resourceMap[type];
    }
    return 'string';
  }

  /**
   * @param {Token} token
   * @param {Tokens} tokens
   * @param {Config} options
   * @returns {string}
   */
  function tokenToValue(token: TransformedToken, tokens: TransformedTokens, options: Config) {
    let originalValue = options.usesDtcg ? token.original.$value : token.original.value;
    if (file?.options && file.options.outputReferences && usesReferences(originalValue)) {
      return `@${tokenToType(token, options)}/${
        getReferences(originalValue, tokens, {
          usesDtcg: options.usesDtcg,
          warnImmediately: false,
        })[0].name
      }`;
    } else {
      return options.usesDtcg ? token.$value : token.value;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>

${header}
<resources>
  ${dictionary.allTokens
    .map(
      (token) =>
        `<${tokenToType(token, options)} name="${token.name}">${tokenToValue(
          token,
          dictionary.tokens,
          options,
        )}</${tokenToType(token, options)}>${token.comment ? `<!-- ${token.comment} -->` : ''}`,
    )
    .join(`\n  `)}
</resources>`;
};
